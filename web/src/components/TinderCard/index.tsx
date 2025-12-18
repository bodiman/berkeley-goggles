import { useRef, useImperativeHandle, forwardRef } from 'react'
import { useSpring, animated } from '@react-spring/web'

export interface TinderCardRef {
  swipe: (direction?: string) => void;
  restoreCard: () => void;
}

export interface DragState {
  dx: number;
  dy: number;
  direction: 'up' | 'down' | 'left' | 'right' | null;
  progress: number;
  vx: number;
  vy: number;
}

export interface TinderCardProps {
  children: React.ReactNode;
  className?: string;
  onSwipe?: (direction: string) => void;
  onCardLeftScreen?: () => void;
  onDragMove?: (dragState: DragState) => void;
  onDragEnd?: () => void;
  onSwipeRequirementFulfilled?: (direction: string) => void;
  onSwipeRequirementUnfulfilled?: () => void;
  preventSwipe?: string[];
  swipeRequirementType?: 'velocity' | 'position';
  swipeThreshold?: number;
  flickOnSwipe?: boolean;
}

const TinderCard = forwardRef<TinderCardRef, TinderCardProps>(({
  children,
  className = '',
  onSwipe,
  onCardLeftScreen,
  onDragMove,
  onDragEnd,
  onSwipeRequirementFulfilled,
  onSwipeRequirementUnfulfilled,
  preventSwipe = [],
  swipeRequirementType = 'velocity',
  swipeThreshold = 0.1,
  flickOnSwipe = true,
}, ref) => {
  const [{ xyrot }, setSpringTarget] = useSpring(() => ({
    xyrot: [0, 0, 0],
    config: { tension: 400, friction: 40 }
  }))

  const gestureState = useRef({
    dx: 0,
    dy: 0,
    vx: 0,
    vy: 0,
    startTime: 0,
    startX: 0,
    startY: 0,
    currentDirection: null as string | null,
    isDragging: false,
    wasMovingOnRelease: false,
    lastMoveTime: 0
  })

  const getDirection = (vx: number, vy: number, dx: number, dy: number) => {
    if (swipeRequirementType === 'velocity') {
      const absVx = Math.abs(vx)
      const absVy = Math.abs(vy)
      if (absVx > absVy) {
        return vx > 0 ? 'right' : 'left'
      } else {
        return vy > 0 ? 'down' : 'up'
      }
    } else {
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)
      if (absDx > absDy) {
        return dx > 0 ? 'right' : 'left'
      } else {
        return dy > 0 ? 'down' : 'up'
      }
    }
  }

  const getSwipeRequirementFulfilled = (vx: number, vy: number, dx: number, dy: number) => {
    if (swipeRequirementType === 'velocity') {
      const velocity = Math.sqrt(vx * vx + vy * vy)
      console.log('Velocity check:', { velocity, threshold: swipeThreshold, fulfilled: velocity > swipeThreshold })
      return velocity > swipeThreshold
    } else {
      const distance = Math.sqrt(dx * dx + dy * dy)
      console.log('Distance check:', { distance, threshold: swipeThreshold, fulfilled: distance > swipeThreshold })
      return distance > swipeThreshold
    }
  }

  const handleMove = (dx: number, dy: number, vx: number, vy: number) => {
    const rot = vx * 0 // reduced rotation factor (was 15)
    setSpringTarget.start({ xyrot: [dx, dy, rot] })
    
    // Track movement for flick detection
    gestureState.current.lastMoveTime = Date.now()
    
    const direction = getDirection(vx, vy, dx, dy)
    const progress = Math.min(Math.sqrt(dx * dx + dy * dy) / 80, 1) // normalize over 80px for faster response
    
    // Calculate direction based on dominant axis with lower threshold
    let primaryDirection: 'up' | 'down' | 'left' | 'right' | null = null
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      if (Math.abs(dx) > Math.abs(dy)) {
        primaryDirection = dx > 0 ? 'right' : 'left'
      } else {
        primaryDirection = dy > 0 ? 'down' : 'up'
      }
    }

    const dragState: DragState = {
      dx,
      dy,
      direction: primaryDirection,
      progress,
      vx,
      vy
    }

    onDragMove?.(dragState)

    // Handle swipe requirement callbacks
    const isFulfilled = getSwipeRequirementFulfilled(vx, vy, dx, dy)
    if (isFulfilled && gestureState.current.currentDirection !== direction) {
      gestureState.current.currentDirection = direction
      if (!preventSwipe.includes(direction)) {
        onSwipeRequirementFulfilled?.(direction)
      }
    } else if (!isFulfilled && gestureState.current.currentDirection) {
      gestureState.current.currentDirection = null
      onSwipeRequirementUnfulfilled?.()
    }
  }

  const handleEnd = (dx: number, dy: number, vx: number, vy: number) => {
    gestureState.current.isDragging = false
    onDragEnd?.()

    const direction = getDirection(vx, vy, dx, dy)
    const isFulfilled = getSwipeRequirementFulfilled(vx, vy, dx, dy)
    
    // Check if this was a flick gesture (released while moving)
    const timeSinceLastMove = Date.now() - gestureState.current.lastMoveTime
    const wasFlicked = timeSinceLastMove < 100 // Released within 100ms of last movement
    
    console.log('HandleEnd:', { 
      dx, dy, vx, vy, direction, isFulfilled, preventSwipe, 
      flickOnSwipe, wasFlicked, timeSinceLastMove 
    })

    // Determine if swipe should trigger
    let shouldSwipe = isFulfilled && !preventSwipe.includes(direction)
    
    if (flickOnSwipe && shouldSwipe) {
      // If flick is required, only swipe if user released while moving
      shouldSwipe = wasFlicked
      console.log('Flick check:', { flickRequired: flickOnSwipe, wasFlicked, shouldSwipe })
    }

    if (shouldSwipe) {
      console.log('Swiping!', direction)
      // Swipe the card off screen
      const multiplier = 3
      setSpringTarget.start({ 
        xyrot: [dx * multiplier, dy * multiplier, vx * 5],
        config: { tension: 200, friction: 20 }
      })
      onSwipe?.(direction)
      setTimeout(() => {
        onCardLeftScreen?.()
      }, 300)
    } else {
      console.log('Returning to center, shouldSwipe:', shouldSwipe, 'reason:', !wasFlicked ? 'not flicked' : 'requirements not met')
      // Return to center
      setSpringTarget.start({ 
        xyrot: [0, 0, 0],
        config: { tension: 400, friction: 40 }
      })
      onSwipeRequirementUnfulfilled?.()
    }
  }

  const gestureStateFromWebEvent = (event: MouseEvent | TouchEvent) => {
    const isTouchEvent = 'touches' in event
    // For touch end events, touches array is empty, so use changedTouches
    const clientX = isTouchEvent ? 
      (event.touches[0]?.clientX ?? event.changedTouches?.[0]?.clientX) : 
      event.clientX
    const clientY = isTouchEvent ? 
      (event.touches[0]?.clientY ?? event.changedTouches?.[0]?.clientY) : 
      event.clientY

    if (gestureState.current.startTime === 0) {
      gestureState.current.startTime = Date.now()
      gestureState.current.startX = clientX
      gestureState.current.startY = clientY
      gestureState.current.isDragging = true
    }

    const dx = clientX - gestureState.current.startX
    const dy = clientY - gestureState.current.startY
    const dt = Date.now() - gestureState.current.startTime
    const vx = dt > 0 && !isNaN(dx) ? (dx / dt) * 1000 : 0 // Convert to pixels per second
    const vy = dt > 0 && !isNaN(dy) ? (dy / dt) * 1000 : 0 // Convert to pixels per second

    console.log('Gesture state:', { dx, dy, dt, vx, vy, clientX, clientY })

    gestureState.current.dx = dx
    gestureState.current.dy = dy
    gestureState.current.vx = vx
    gestureState.current.vy = vy

    return { dx, dy, vx, vy }
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    gestureState.current.startTime = 0
    const { dx, dy, vx, vy } = gestureStateFromWebEvent(event.nativeEvent)
    handleMove(dx, dy, vx, vy)
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!gestureState.current.isDragging) return
    const { dx, dy, vx, vy } = gestureStateFromWebEvent(event.nativeEvent)
    handleMove(dx, dy, vx, vy)
  }

  const handleMouseUp = (_event: React.MouseEvent) => {
    if (!gestureState.current.isDragging) return
    // Use the last known values instead of trying to get them from the end event
    const { dx, dy, vx, vy } = gestureState.current
    console.log('MouseUp using stored values:', { dx, dy, vx, vy })
    handleEnd(dx, dy, vx, vy)
    gestureState.current.startTime = 0
  }

  const handleTouchStart = (event: React.TouchEvent) => {
    gestureState.current.startTime = 0
    const { dx, dy, vx, vy } = gestureStateFromWebEvent(event.nativeEvent)
    handleMove(dx, dy, vx, vy)
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    const { dx, dy, vx, vy } = gestureStateFromWebEvent(event.nativeEvent)
    handleMove(dx, dy, vx, vy)
  }

  const handleTouchEnd = (_event: React.TouchEvent) => {
    // Use the last known values instead of trying to get them from the end event
    const { dx, dy, vx, vy } = gestureState.current
    console.log('TouchEnd using stored values:', { dx, dy, vx, vy })
    handleEnd(dx, dy, vx, vy)
    gestureState.current.startTime = 0
  }

  useImperativeHandle(ref, () => ({
    swipe: (direction = 'left') => {
      const multiplier = 3
      const directions = {
        left: [-100 * multiplier, 0, -5],
        right: [100 * multiplier, 0, 5],
        up: [0, -100 * multiplier, 0],
        down: [0, 100 * multiplier, 0]
      }
      
      const [x, y, rot] = directions[direction as keyof typeof directions] || directions.left
      setSpringTarget.start({ 
        xyrot: [x, y, rot],
        config: { tension: 200, friction: 20 }
      })
      onSwipe?.(direction)
      setTimeout(() => {
        onCardLeftScreen?.()
      }, 300)
    },
    restoreCard: () => {
      setSpringTarget.start({ 
        xyrot: [0, 0, 0],
        config: { tension: 400, friction: 40 }
      })
    }
  }))

  return (
    <animated.div
      className={className}
      style={{
        transform: xyrot.to((x, y, rot) => `translate3d(${x}px, ${y}px, 0px) rotate(${rot}deg)`),
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </animated.div>
  )
})

TinderCard.displayName = 'TinderCard'

export default TinderCard
export { TinderCard }