import React from 'react';
import './SortingVisualizer.css';

// Change this value for the number of bars (value) in the array.
const BAR_WIDTH = 5;

const NUMBER_OF_ARRAY_BARS = window.innerHeight <= 640 ? 45 : 170;

const MAX_HEIGHT = window.innerHeight <= 640 ? 560 : 700;

let ANIMATION_SPEED_MS = 1;

// This is the main color of the array bars.
const PRIMARY_COLOR = 'aqua';

const SECONDARY_COLOR = "red";

const BUSY_MESSAGE = "Busy Right Now!";

class SortingVisualizer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            array: [],
            isRunning: false,
            isDarkMode: false
        };
    }

    componentDidMount() {
        this.resetArray();
    }

    resetArray() {
        if (this.state.isRunning) {
            alert(BUSY_MESSAGE);
            return;
        }
        const array = [];
        for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
            array.push(randomIntFromInterval(5, MAX_HEIGHT));
        }
        this.setState({ array });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Merge Sort Algorithm Starts From Here
    mergeSort() {
        const result = this.activate("mergeSort");
        if (!result) return;

        const animations = [];
        const array = this.state.array;
        this.sort(array, 0, array.length - 1, animations);
        this.manageChangeAnimations(animations, 2, "mergeSort");
    }

    merge(array, start, mid, end, animations) {
        let start2 = mid + 1;
        // If the direct merge is already sorted
        if (array[mid] <= array[start2]) {
            return;
        }
        // Two pointers to maintain start
        // of both arrays to merge
        while (start <= mid && start2 <= end) {

            // If element 1 is in right place
            if (array[start] <= array[start2]) {
                animations.push(["comparision1", start, start2]);
                animations.push(["comparision2", start, start2]);
                start++;
            }
            else {
                let value = array[start2];
                let index = start2;

                // Shift all the elements between element 1
                // element 2, right by 1.
                while (index != start) {
                    animations.push(["swap", index, array[index - 1]]);
                    animations.push(["swap", index - 1, value]);
                    array[index] = array[index - 1];
                    index--;
                }
                array[start] = value;

                // Update all the pointers
                start++;
                mid++;
                start2++;
            }
        }
    }

    sort(array, l, r, animations) {
        if (l < r) {
            // Find the middle point
            let m = (l + r) >> 1;
            // Sort first and second halves
            this.sort(array, l, m, animations);
            this.sort(array, m + 1, r, animations);
            // Merge the sorted halves
            this.merge(array, l, m, r, animations);
        }
    }
    // Merge Sort Algorithm Ends Here
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Heap Sort Algorithm Starts From Here
    heapSort() {
        const result = this.activate("heapSort");
        if (!result) return;

        const animations = [];
        const array = this.state.array;
        this.hSort(array, animations);
        this.manageChangeAnimations(animations, 2, "heapSort");
    }

    //Implementation of Heap Sort
    hSort(array, animations) {
        let n = array.length;
        // Build heap (rearrange array)
        for (let i = (n >> 1) - 1; i >= 0; i--) {
            this.heapify(array, n, i, animations);
        }
        // One by one extract an element from heap
        for (let i = n - 1; i > 0; i--) {
            // Move current root to end
            animations.push(["swap", 0, array[i]]);
            animations.push(["swap", i, array[0]]);
            array[0] = array[0] + array[i] - (array[i] = array[0]);
            // call max heapify on the reduced heap
            this.heapify(array, i, 0, animations);
        }
    }

    heapify(array, n, i, animations) {
        let largest = i; // Initialize largest as root
        let l = 2 * i + 1; // left = 2*i + 1
        let r = 2 * i + 2; // right = 2*i + 2

        // If left child is larger than root
        if (l < n) {
            animations.push(["comparision1", l, largest]);
            animations.push(["comparision2", l, largest]);
        }
        if (l < n && array[l] > array[largest])
            largest = l;

        // If right child is larger than largest so far
        if (r < n) {
            animations.push(["comparision1", r, largest]);
            animations.push(["comparision2", r, largest]);
        }
        if (r < n && array[r] > array[largest])
            largest = r;

        // If largest is not root
        if (largest != i) {
            animations.push(["swap", i, array[largest]]);
            animations.push(["swap", largest, array[i]]);
            array[i] = array[i] + array[largest] - (array[largest] = array[i]);
            // Recursively heapify the affected sub-tree
            this.heapify(array, n, largest, animations);
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    bubbleSort() {
        const result = this.activate("bubbleSort");
        if (!result) return;

        const animations = [];
        const auxillaryArray = this.state.array;

        for (let index = 0; index < auxillaryArray.length; index++) {
            for (let i = 0; i < auxillaryArray.length - index - 1; ++i) {
                //comparing i and i + 1 indexes...
                //comparision two is just to revert the color
                animations.push(["comparision1", i, i + 1]);
                animations.push(["comparision2", i, i + 1]);

                if (auxillaryArray[i] > auxillaryArray[i + 1]) {
                    animations.push(["swap", i, auxillaryArray[i + 1]]);
                    animations.push(["swap", i + 1, auxillaryArray[i]]);
                    auxillaryArray[i] = auxillaryArray[i] + auxillaryArray[i + 1] - (auxillaryArray[i + 1] = auxillaryArray[i]);
                }
            }
        }
        this.manageChangeAnimations(animations, 1, "bubbleSort");
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    partition(array, low, high, animations) {

        // pivot
        let pivot = array[high];

        // Index of smaller element and
        // indicates the right position
        // of pivot found so far
        let i = (low - 1);

        for (let j = low; j <= high - 1; j++) {

            // If current element is smaller
            // than the pivot
            animations.push(['comparision1', j, high]);
            animations.push(['comparision2', j, high]);
            if (array[j] < pivot) {

                // Increment index of
                // smaller element
                i++;
                animations.push(['swap', i, array[j]]);
                animations.push(['swap', j, array[i]]);
                array[i] = array[i] + array[j] - (array[j] = array[i]);
            }
        }
        animations.push(['swap', i + 1, array[high]]);
        animations.push(['swap', high, array[i + 1]]);
        array[i + 1] = array[i + 1] + array[high] - (array[high] = array[i + 1]);
        return i + 1;
    }

    quickSort(array, low, high, animations) {
        if (low < high) {
            // pi is partitioning index, arr[p]
            // is now at right place
            let pi = this.partition(array, low, high, animations);
            // Separately sort elements before
            // partition and after partition
            this.quickSort(array, low, pi - 1, animations);
            this.quickSort(array, pi + 1, high, animations);
        }
    }

    qSort() {
        const result = this.activate("quickSort");
        if (!result) return;

        const animations = [];
        const auxillaryArray = this.state.array;
        this.quickSort(auxillaryArray, 0, auxillaryArray.length - 1, animations);
        this.manageChangeAnimations(animations, 1, "quickSort");

    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    selectionSort() {
        const result = this.activate("selectionSort");
        if (!result) return;

        const animations = [];
        const auxillaryArray = this.state.array;

        for (let index = 0; index < auxillaryArray.length; index++) {
            let minima = index;
            for (let i = index + 1; i < auxillaryArray.length; ++i) {
                //comparing i and minima indexes...
                //comparision two is just to revert the color
                animations.push(["comparision1", i, minima]);
                animations.push(["comparision2", i, minima]);
                if (auxillaryArray[i] < auxillaryArray[minima])
                    minima = i;
            }
            if (minima != index) {
                animations.push(["swap", index, auxillaryArray[minima]]);
                animations.push(["swap", minima, auxillaryArray[index]]);
                auxillaryArray[index] = auxillaryArray[index] + auxillaryArray[minima] - (auxillaryArray[minima] = auxillaryArray[index]);
            }
        }
        this.manageChangeAnimations(animations, 1, "selectionSort");
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    manageChangeAnimations(animations, value, id) {
        for (let i = 0; i < animations.length; i++) {
            const isColorChange = animations[i][0] == "comparision1" || animations[i][0] == "comparision2";
            const arrayBars = document.getElementsByClassName('array-bar');
            if (isColorChange === true) {
                const color = (animations[i][0] == "comparision1") ? SECONDARY_COLOR : PRIMARY_COLOR;
                const [comparision, barOneIndex, barTwoIndex] = animations[i];
                const barOneStyle = arrayBars[barOneIndex].style;
                const barTwoStyle = arrayBars[barTwoIndex].style;
                setTimeout(() => {
                    barOneStyle.backgroundColor = color;
                    barTwoStyle.backgroundColor = color;
                    if (i == animations.length - 1)
                        this.deactivate(id);
                }, i * ANIMATION_SPEED_MS);
            }
            else {
                const [swap, barIndex, newHeight] = animations[i];
                if (barIndex === -1) {
                    continue;
                }
                const barStyle = arrayBars[barIndex].style;
                setTimeout(() => {
                    barStyle.height = `${newHeight}px`;
                    if (i == animations.length - 1)
                        this.deactivate(id);
                }, i * ANIMATION_SPEED_MS);
            }
        }
    }

    activate(id) {
        if (this.state.isRunning) {
            alert(BUSY_MESSAGE);
            return false;
        }
        this.state.isRunning = true;
        document.getElementById(id).style.backgroundColor = '#4CAF50';
        return true;
    }

    deactivate(id) {
        this.state.isRunning = false;
        document.getElementById(id).style.backgroundColor = '#282c34';
    }

    toggleTheme() {
        if (this.state.isDarkMode)
            document.getElementsByTagName("body")[0].style.backgroundColor = 'white';
        else
            document.getElementsByTagName("body")[0].style.backgroundColor = '#282c34';

        this.state.isDarkMode = !this.state.isDarkMode;
    }

    changeAnimationSpeed() {
        ANIMATION_SPEED_MS = 6 - document.getElementById("animation_speed").value;
    }

    render() {

        const { array } = this.state;

        return (
            <div className="directive-container">
                <div className="header-box">
                    <label> &nbsp; &nbsp;Animation Speed &nbsp; <input type="range" min="1" max="5" id="animation_speed" onChange={() => this.changeAnimationSpeed()} /> </label>
                    <button className="button-custom" id="genNewArray" onClick={() => this.resetArray()}>Generate Array</button>
                    <button className="button-custom" id="quickSort" onClick={() => this.qSort()}>Quick Sort</button>
                    <button className="button-custom" id="mergeSort" onClick={() => this.mergeSort()}>Merge Sort</button>
                    <button className="button-custom" id="heapSort" onClick={() => this.heapSort()}>Heap Sort</button>
                    <button className="button-custom" id="selectionSort" onClick={() => this.selectionSort()}>Selection Sort</button>
                    <button className="button-custom" id="bubbleSort" onClick={() => this.bubbleSort()}>Bubble Sort</button>
                    <button className="button-custom" id="toggleTheme" onClick={() => this.toggleTheme()}>Toggle Theme</button>
                </div>

                <div className="array-container">
                    {array.map((value, idx) => (
                        <div
                            className="array-bar"
                            key={idx}
                            style={{
                                backgroundColor: PRIMARY_COLOR,
                                width: `${BAR_WIDTH}px`,
                                height: `${value}px`
                            }}></div>
                    ))}
                </div>
            </div>
        );
    }

}

// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default SortingVisualizer;