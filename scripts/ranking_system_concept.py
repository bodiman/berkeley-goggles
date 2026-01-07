"""
Bradley–Terry (truth) + Trophy Progression (product layer)
"""

import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm

# -----------------------------
# Config
# -----------------------------
players = 100
games_played_per_person = 100

# Bradley–Terry
K_BT = 0.05
tightness = 2.0        # how deterministic true outcomes are

# Trophy system
WIN_GAIN = 35
LOSS_PENALTY = 25
TARGET_MEAN = 1500
TARGET_STD = 430
FADE_WIDTH = 300       # how wide the "approach target" zone is

# Matchmaking
SIGMA_MATCH = 0.4      # controls how close opponents are in BT space

rng = np.random.default_rng(48)

# -----------------------------
# True skills (unknown to system)
# -----------------------------
true_skills = rng.standard_normal(players)

# -----------------------------
# Hidden Bradley–Terry scores
# -----------------------------
theta = np.zeros(players)     # latent log-strengths
games = np.zeros(players)

# -----------------------------
# Trophy scores (displayed)
# -----------------------------
trophies = np.zeros(players)

# -----------------------------
# Bradley–Terry update
# -----------------------------
def bt_update(a, b, outcome, K=0.05):
    p = np.exp(a) / (np.exp(a) + np.exp(b))
    delta = K * (outcome - p)
    return a + delta, b - delta

# -----------------------------
# Map BT scores → target trophies
# (percentile → Normal(1500, 430))
# -----------------------------
def target_trophies(theta):
    ranks = np.argsort(np.argsort(theta))
    p = (ranks + 1) / (len(theta) + 1)
    z = norm.ppf(p)
    return TARGET_MEAN + TARGET_STD * z

# -----------------------------
# Matchmaking: choose opponent
# so P(win) ≈ 0.5 (BT-based)
# -----------------------------
def choose_opponent(i, theta):
    diffs = theta - theta[i]
    probs = np.exp(-0.5 * (diffs / SIGMA_MATCH) ** 2)
    probs[i] = 0.0
    probs /= probs.sum()
    return rng.choice(len(theta), p=probs)

# -----------------------------
# Simulation loop
# -----------------------------
num_games = games_played_per_person * players

for _ in range(num_games):
    i = rng.integers(players)
    j = choose_opponent(i, theta)

    # True outcome (unknown to system)
    p_true = 1 / (1 + np.exp(-tightness * (true_skills[i] - true_skills[j])))
    i_wins = rng.random() < p_true

    games[i] += 1
    games[j] += 1

    # ---- BT update (truth layer) ----
    if i_wins:
        theta[i], theta[j] = bt_update(theta[i], theta[j], 1, K_BT)
    else:
        theta[j], theta[i] = bt_update(theta[j], theta[i], 1, K_BT)

    # ---- Trophy update (product layer) ----
    targets = target_trophies(theta)

    def trophy_step(player, win):
        gap = targets[player] - trophies[player]
        scale = np.clip(gap / FADE_WIDTH, 0, 1)

        win_gain = WIN_GAIN * scale
        loss_penalty = LOSS_PENALTY * scale

        if win:
            trophies[player] += win_gain
        else:
            trophies[player] -= loss_penalty

        trophies[player] = max(0, trophies[player])

    trophy_step(i, i_wins)
    trophy_step(j, not i_wins)