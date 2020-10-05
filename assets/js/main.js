let [num1, num4, num3, num2] = document.querySelectorAll(".num");
let tl = anime.timeline();

window.onload = () => {
    // firstScan();
    // moveE1(num4, num2);
    // moveE2(num4, num2);
    // endScan();
};

function firstScan() {
    let seq = [num1, num4, num3, num2];
    for (let i = 0; i < seq.length; i++) {
        let color = [1, 3].includes(i) ? "#ea9797" : "#afea97";
        tl.add({
            targets: seq[i],
            keyframes: [
                { backgroundColor: color },
                { backgroundColor: "#fff" },
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
        duration: 300 * 2,
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
    tl.add(
        {
            targets: e2,
            keyframes: [
                { translateY: 40 },
                { translateX: getRelativeX(e2, e1) },
                { translateY: 0 },
            ],
            duration: 2500,
            easing: "easeOutElastic(1, .8)",
        },
        "-=2500"
    );
}

let nums = [num1, num2, num3, num4];
let brackets = document.querySelectorAll(".bracket");

let dragVal,
    dragapprove = true;
nums.map((num) => {
    num.ondragstart = (e) => {
        // let arr = document.getElementsByClassName("arr")[0];
        requestAnimationFrame(() => {
            e.target.classList.add("hide-while-dragged");
            // e.dataTransfer.setData("text", e.target.id)
            dragVal = e.target;
        });
    };
    num.ondragend = (e) => {
        e.srcElement.classList.remove("hide-while-dragged");
    };

    num.ondragover = (e) => {
        if (!dragapprove) return;
        if (dragVal === e.target) return;
        dragapprove = false;
        e.preventDefault();
        let nodes = e.path[1].childNodes,
            numOrd = [];

        for (let i = 0; i < nodes.length; i++) {
            if (nums.includes(nodes[i])) {
                numOrd.push(nodes[i]);
            }
        }

        let gap = numOrd.indexOf(dragVal),
            hovering = numOrd.indexOf(e.target),
            backwards = gap > hovering;

        // console.log(gap, hovering);
        // if (!backwards) {
        //     gap++;
        //     hovering++;
        // }

        let Anums = [e.target],
            numToAnim = Math.abs(gap - hovering) - 1;

        if (numToAnim > 0) {
            for (let i = 0; i < numToAnim; i++) {
                let index;
                index = backwards ? hovering - i : hovering + i;
                if (index === gap) continue;
                Anums.push(numOrd[index]);
            }
        }
        let bf = [],
            af = [],
            newArray;

        // Finding Static Elements
        for (let i = 0; i < numOrd.length; i++) {
            if (i === gap || i === hovering) continue;
            else if (i < Math.min(gap, hovering)) {
                bf.push(numOrd[i]);
            } else if (i > Math.max(gap, hovering)) {
                af.push(numOrd[i]);
            } else continue;
        }

        // console.log("before", bf);
        // console.log("anim", Anums);
        // console.log("after", af);
        // Compose Array
        if (backwards) {
            bf.push(dragVal);
            newArray = bf.concat(Anums);
        } else {
            newArray = bf.concat(Anums);
            newArray.push(dragVal);
        }
        newArray = newArray.concat(af);

        console.log("New" , newArray);


        let xdist;

        for (let i = 0; i < Anums.length; i++) {
            if (i === 0) {
                xdist = -89;
                // xdist = getRelativeX(toAnimate[i], dragVal) + 10000;
                if (gap > hovering) {
                    xdist *= -1;
                }
            }
            anime({
                targets: Anums[i],
                translateX: xdist,
                duration: 175,
                easing: "easeOutElastic(1, .8)",
            });
        }

        setTimeout(() => {
            newArray.map((el) => {
                if (el !== dragVal) {
                    el.style.transform = "translateX(0)";
                }
            });
            let arr = e.path[1];
            while (arr.firstChild) {
                arr.removeChild(arr.firstChild);
            }

            newArray.unshift(brackets[0]);
            newArray.push(brackets[1]);

            newArray.map((el) => {
                arr.appendChild(el);
            });
            dragapprove = true;
        }, 200);
    };
    num.ondrop = (e) => {
        e.preventDefault();
        // e.target.appendChild(draggedIcon);
    };
});
