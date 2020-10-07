class UI {
    static enableDragNumbers() {
        nums.map((num) => {
            num.ondragstart = (e) => {
                // e.preventDefault();
                let img = e.target.cloneNode(true);
                img.classList.add("drag-num");
                img.id = "tempDrag";
                img.style.backgroundColor = "ffffff00";
                document.body.appendChild(img);
                e.dataTransfer.setDragImage(img, 25, 25);
                requestAnimationFrame(() => {
                    (img.style.opacity = "0"), (e.target.style.opacity = "0");
                    dragVal = e.target;
                });
            };
            num.ondragend = (e) => {
                e.preventDefault();
                e.target.style.opacity = "100%";
                document.body.removeChild(document.getElementById("tempDrag"));
            };
            num.ondragover = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!dragapprove) return; //stop unwanted overcalls
                if (dragVal === e.target) return; //no change if hover over self
                dragapprove = false; // ensure function not called while animating

                let numOrd = getCurrentArrOrdered(),
                    gap = numOrd.indexOf(dragVal),
                    hovering = numOrd.indexOf(e.target),
                    backwards = gap > hovering,
                    Anums = [],
                    numToAnim = Math.abs(gap - hovering) - 1;

                // Make list of elements to Animate
                while (numToAnim !== 0) {
                    if (backwards) {
                        Anums.unshift(numOrd[hovering + numToAnim]);
                    } else {
                        Anums.push(numOrd[hovering - numToAnim]);
                    }
                    numToAnim--;
                }
                backwards ? Anums.unshift(e.target) : Anums.push(e.target);

                let bf = [],
                    af = [],
                    newArray;

                // Finding Static Elements (not animated)
                for (let i = 0; i < numOrd.length; i++) {
                    if (i === gap || i === hovering) continue;
                    else if (i < Math.min(gap, hovering)) {
                        bf.push(numOrd[i]);
                    } else if (i > Math.max(gap, hovering)) {
                        af.push(numOrd[i]);
                    } else continue;
                }

                // Creating New array from static and animated
                if (backwards) {
                    bf.push(dragVal);
                    newArray = bf.concat(Anums);
                } else {
                    newArray = bf.concat(Anums);
                    newArray.push(dragVal);
                }
                newArray = newArray.concat(af);

                // Animate number movement
                let xdist = getRelativeX(numOrd[1], numOrd[0]);
                xdist = backwards ? xdist * -1 : xdist;

                Anums.map((node) => {
                    anime({
                        targets: node,
                        translateX: xdist,
                        duration: 175,
                        easing: "easeOutElastic(1, .8)",
                        complete: () => {
                            let arr = e.path[1];
                            UI.updateArr(arr, newArray);
                            dragapprove = true; // this function can now be called again
                        },
                    });
                });
            };
            num.ondrop = (e) => {
                e.preventDefault();
            };
        });
    }

    static updateArr(arr, newValues) {
        arr = removeAllChildNodes(arr);
        newValues.unshift(brackets[0]);
        newValues.push(brackets[1]);
        newValues.map((el) => {
            el.style.transform = "none";
            arr.appendChild(el);
        });
    }
}
