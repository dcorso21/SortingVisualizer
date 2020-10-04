let [num1, num2, num3, num4] = document.querySelectorAll(".num");
anime({
    targets: num2,
    keyframes: [
        { translateY: -40 },
        { translateX: getRelativeX(num2, num4) },
        // {translateY: 40},
        // {translateX: 0},
        { translateY: 0 },
    ],
    duration: 2500,
    delay: anime.stagger(100),
    easing: "easeOutElastic(1, .8)",
    //   loop: true
});

anime({
    targets: num4,
    keyframes: [
        { translateY: 40 },
        { translateX: getRelativeX(num4, num2) },
        // {translateY: 40},
        // {translateX: 0},
        { translateY: 0 },
    ],
    duration: 2500,
    delay: anime.stagger(100),
    easing: "easeOutElastic(1, .8)",
    //   loop: true
});

function getRelativeX(targetElement, movingElement) {
    return (
        movingElement.getBoundingClientRect().x -
        targetElement.getBoundingClientRect().x
    );
}
