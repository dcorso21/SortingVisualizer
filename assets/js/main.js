let [num1, num4, num3, num2] = document.querySelectorAll(".num");
let tl = anime.timeline()

window.onload = () => {
    firstScan();
    moveE1(num4, num2);
    moveE2(num4, num2);
    endScan();
};

function firstScan() {
    let seq = [num1, num4, num3, num2];
    for (let i = 0; i < seq.length; i++) {
        let color = [1, 3].includes(i) ? "#ea9797" : "#afea97";
        tl.add({
            targets: seq[i],
            keyframes: [
                {backgroundColor: color},
                {backgroundColor: "#fff"},
            ],
            duration: 700,
            easing: "linear",
            direction: "alternate",
        });
    }
}

function endScan() {
    tl.add({
        targets: [num1, num2, num3, num4],
        backgroundColor: ["#fff", "#afea97"],
        duration: 300*2,
        easing: "linear",
        delay: anime.stagger(300),
        direction: "alternate",
        // loop: true,
    });
}

function getRelativeX(targetElement, movingElement) {
    return (
        movingElement.getBoundingClientRect().x -
        targetElement.getBoundingClientRect().x
    );
}

// Scan list of numbers
// Switch Numbers
// Scan again
function moveE1(e1, e2) {
    tl.add({
        targets: e1,
        keyframes: [
            { translateY: -40 },
            { translateX: getRelativeX(e1, e2) },
            { translateY: 0 },
        ],
        duration: 2500,
        easing: "easeOutElastic(1, .8)",
    });
}

function moveE2(e1, e2) {
    tl.add({
        targets: e2,
        keyframes: [
            { translateY: 40 },
            { translateX: getRelativeX(e2, e1) },
            { translateY: 0 },
        ],
        duration: 2500,
        easing: "easeOutElastic(1, .8)",
    }, "-=2500");
}
