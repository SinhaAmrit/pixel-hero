/**
 * The function checks if the browser supports the CanvasRenderingContext2D object and if the user is
 * on a mobile or Android device, and displays an alert message if either condition is true.
 */
function checkSupport() {
    // Enhanced checks for wider browser and device compatibility
    const canvasSupported = !!(window.CanvasRenderingContext2D);
    const isMobile = /Mobi|Android|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 768 && window.innerHeight < 600; // Adjust size thresholds as needed

    if (!canvasSupported || isMobile || isSmallScreen) {
        document.getElementById("unsupported-message").style.display = "block";
    }
}

checkSupport();

/* The `kaboom()` function is initializing the Kaboom game engine and setting the width and height of
the game window to 1280 pixels and 720 pixels, respectively. */
kaboom({
    width: 1280,
    height: 720
})

/* The `loadSpriteAtlas()` function is used to load a sprite atlas, which is a single image file that
contains multiple smaller images or sprites. In this case, the sprite atlas is loaded from the file
"assets/tileset.png". */
loadSpriteAtlas('assets/tileset.png', {
    'platform-left': {
        x: 82, y: 64, width: 16,
        height: 8
    },
    'platform-middle': {
        x: 112,
        y: 64,
        width: 16,
        height: 8
    },
    'platform-right': {
        x: 142,
        y: 64,
        width: 16,
        height: 8
    },
    'smaller-tree': {
        x: 0,
        y: 80,
        width: 60,
        height: 65
    },
    'bigger-tree': {
        x: 170,
        y: 10,
        width: 115,
        height: 200
    },
    'ground': {
        x: 80,
        y: 144,
        width: 16,
        height: 16
    },
    'ground-deep': {
        x: 0,
        y: 144,
        width: 16,
        height: 16
    }
})

/* The `loadSprite()` function is used to load individual sprites or images for use in the game. It
takes two parameters: the name of the sprite and the file path of the image. */
loadSprite('background-0', 'assets/background_0.png')
loadSprite('background-1', 'assets/background_1.png')
loadSprite('background-2', 'assets/background_2.png')
loadSprite('idle-sprite', 'assets/Idle.png', {
    sliceX: 8,
    sliceY: 1,
    anims: { 'idle-anim': { from: 0, to: 7, loop: true } }
})
loadSprite('run-sprite', 'assets/Run.png', {
    sliceX: 8,
    sliceY: 1,
    anims: { 'run-anim': { from: 0, to: 7, loop: true } }
})

loadSprite('jump-sprite', 'assets/Jump.png', {
    sliceX: 2,
    sliceY: 1,
    anims: { 'jump-anim': { from: 0, to: 1, loop: true } }
})

loadSprite('fall-sprite', 'assets/Fall.png', {
    sliceX: 2,
    sliceY: 1,
    anims: { 'fall-anim': { from: 0, to: 1, loop: true } }
})

setGravity(1000)

add([
    sprite('background-0'),
    fixed(),
    scale(4)
])

add([
    sprite('background-0'),
    fixed(),
    pos(1000, 0),
    scale(4),
]).flipX = true

add([
    sprite('background-1'),
    fixed(),
    scale(4)
])

add([
    sprite('background-1'),
    fixed(),
    pos(1000, 0),
    scale(4),
]).flipX = true

add([
    sprite('background-2'),
    fixed(),
    scale(4)
])

add([
    sprite('background-2'),
    fixed(),
    pos(1000, 0),
    scale(4),
]).flipX = true

const tree = add([
    sprite('smaller-tree'),
    scale(4),
    pos(40, 190)
])

const map = addLevel([
    '5                                                     5',
    '5                                                     5',
    '5   012                  012                  012     5',
    '5        012                                          5',
    '5                                   012               5',
    '5   012              012                              5',
    '5             012                                     5',
    ' 333333                      012           012        5',
    ' 444444                                               5',
    ' 444444   012                                         5',
    ' 33333333333333333333333333333333333333333333333333333 ',
    ' 44444444444444444444444444444444444444444444444444444 '
], {
    tileWidth: 16,
    tileHeight: 16,
    tiles: {
        0: () => [
            sprite('platform-left'),
            area(),
            body({ isStatic: true })
        ],
        1: () => [
            sprite('platform-middle'),
            area(),
            body({ isStatic: true })
        ],
        2: () => [
            sprite('platform-right'),
            area(),
            body({ isStatic: true })
        ],
        3: () => [
            sprite('ground'),
            area(),
            body({ isStatic: true })
        ],
        4: () => [
            sprite('ground-deep'),
            area(),
            body({ isStatic: true })
        ],
        5: () => [
            rect(16, 16),
            opacity(0),
            area(),
            body({ isStatic: true })
        ]
    }
})

map.use(scale(4))

const biggerTree = add([
    sprite('bigger-tree'),
    scale(4),
    pos(900, 104)
])

const player = add([
    sprite('idle-sprite'),
    scale(2),
    area({ shape: new Rect(vec2(0), 32, 32), offset: vec2(0, 32) }),
    anchor('center'),
    body(),
    pos(900, 10),
    {
        speed: 500,
        previousHeight: null,
        heightDelta: 0,
        direction: 'right'
    }
])

player.play('idle-anim')

onKeyDown('right', () => {
    if (player.curAnim() !== 'run-anim' && player.isGrounded()) {
        player.use(sprite('run-sprite'))
        player.play('run-anim')
    }

    if (player.direction !== 'right') player.direction = 'right'

    player.move(player.speed, 0)
})

onKeyRelease('right', () => {
    player.use(sprite('idle-sprite'))
    player.play('idle-anim')
})

onKeyDown('left', () => {
    if (player.curAnim() !== 'run-anim' && player.isGrounded()) {
        player.use(sprite('run-sprite'))
        player.play('run-anim')
    }

    if (player.direction !== 'left') player.direction = 'left'

    player.move(-player.speed, 0)
})

onKeyRelease('left', () => {
    player.use(sprite('idle-sprite'))
    player.play('idle-anim')
})

onKeyPress('up', () => {
    if (player.isGrounded()) {
        player.jump()
    }
})

camScale(1.5)

onUpdate(() => {
    if (player.previousHeight) {
        player.heightDelta = player.previousHeight - player.pos.y
    }

    player.previousHeight = player.pos.y

    const cameraLeftBound = 550
    const cameraRightBound = 3000
    const cameraVerticalOffset = player.pos.y - 100

    /* This code block is responsible for controlling the camera position based on the player's
    position. */
    if (cameraLeftBound > player.pos.x) {
        camPos(cameraLeftBound, cameraVerticalOffset)
    } else if (cameraRightBound < player.pos.x) {
        camPos(cameraRightBound, cameraVerticalOffset)
    } else {
        camPos(player.pos.x, cameraVerticalOffset)
    }

    /* The code block is checking if the current animation of the player is not the 'run-anim'
    animation and if the player is grounded (touching the ground). If both conditions are true, it
    changes the sprite of the player to 'idle-sprite' and plays the 'idle-anim' animation. This is
    used to switch the player's animation to idle when they are not running and are on the ground. */
    if (player.curAnim() !== 'run-anim' && player.isGrounded()) {
        player.use(sprite('idle-sprite'))
        player.play('idle-anim')
    }

    /* The code block is checking if the current animation of the player is not the 'jump-anim'
    animation, the player is not grounded (not touching the ground), and the player's heightDelta
    (the change in height) is greater than 0. */
    if (player.curAnim() !== 'jump-anim' && !player.isGrounded() && player.heightDelta > 0) {
        player.use(sprite('jump-sprite'))
        player.play('jump-anim')
    }

    /* The code block is checking if the current animation of the player is not the 'fall-anim'
    animation, the player is not grounded (not touching the ground), and the player's heightDelta
    (the change in height) is less than 0. */
    if (player.curAnim() !== 'fall-anim' && !player.isGrounded() && player.heightDelta < 0) {
        player.use(sprite('fall-sprite'))
        player.play('fall-anim')
    }

    /* The code block is checking the value of the `player.direction` variable. If it is equal to
    `'left'`, it sets the `player.flipX` property to `true`, which flips the player sprite
    horizontally. Otherwise, if `player.direction` is not equal to `'left'`, it sets `player.flipX`
    to `false`, which ensures that the player sprite is not flipped horizontally. This code is used
    to control the orientation of the player sprite based on the direction the player is moving. */
    if (player.direction === 'left') {
        player.flipX = true
    } else {
        player.flipX = false
    }
})