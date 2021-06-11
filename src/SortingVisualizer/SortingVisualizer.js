import React from 'react';
import './SortingVisualizer.css';

// Change this value for the number of bars (value) in the array.
const NUMBER_OF_ARRAY_BARS = 170;

const ANIMATION_SPEED_MS = 1;

const BAR_WIDTH = 5;

// This is the main color of the array bars.
const PRIMARY_COLOR = 'aqua';

const SECONDARY_COLOR = "red";

const BUSY = "Busy Right Now!";

class SortingVisualizer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            array: []
        };
    }

    componentDidMount() {
        this.resetArray();
    }

    resetArray() {
        const array = [];
        for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
            array.push(randomIntFromInterval(5, 700));
        }
        this.setState({ array });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Merge Sort Algorithm Starts From Here
    mergeSort() {
        const animations = [];
        const array = this.state.array;
        this.sort(array, 0, array.length - 1, animations);
        this.manageChangeAnimations(animations, 2);
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
        const animations = [];
        const array = this.state.array;
        this.hSort(array, animations);
        this.manageChangeAnimations(animations, 2);
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
        this.manageChangeAnimations(animations, 1);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    selectionSort() {

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
        this.manageChangeAnimations(animations, 1);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    manageChangeAnimations(animations, value) {
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
                }, i * ANIMATION_SPEED_MS);
            }
        }
    }

    render() {

        const { array } = this.state;

        return (
            <div className="directive-container">
                <div className="header-box">
                    <button className="button-custom" id="genNewArray" onClick={() => this.resetArray()}>Generate New Array</button>
                    <button className="button-custom" id="mergeSort" onClick={() => this.mergeSort()}>Merge Sort</button>
                    <button className="button-custom" id="heapSort" onClick={() => this.heapSort()}>Heap Sort</button>
                    <button className="button-custom" id="selectionSort" onClick={() => this.selectionSort()}>Selection Sort</button>
                    <button className="button-custom" id="bubbleSort" onClick={() => this.bubbleSort()}>Bubble Sort</button>
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