const _ = require('lodash');

/**
 * JobQueue using FIFO strategy.
 */
class FifoQueue {

    /**
     * Basic constructor which may optionally process a given
     * initial set of items.
     *
     * @param initialSet
     */
    constructor(initialSet) {
        this.itemSet = Array.isArray(initialSet) ? initialSet : [];
    }

    /**
     * Set all items at once.
     *
     * @param itemSet
     */
    setItems(itemSet) {
        this.itemSet = itemSet;
    }

    /**
     * Get all items at once.
     *
     * @returns {*|Array}
     */
    getItems() {
        return this.itemSet;
    }

    /**
     * Add a single item to the FIFO Queue.
     *
     * @param item
     */
    addItem(item) {
        this.itemSet.unshift(item);
    }

    /**
     * Acquire next item of the FIFO Queue.
     *
     * @returns {T}
     */
    next() {
        return this.itemSet.shift();
    }

    /**
     * Boolean check if the FIFO Queue has remaining items.
     *
     * @returns {boolean}
     */
    hasItem() {
        return !!this.itemSet.length;
    }

    /**
     * Get numeric count of remaining FIFO Queue items.
     *
     * @returns {Number}
     */
    getLength() {
        return this.itemSet.length;
    }

    /**
     * Apply a Filter on the ItemSet to get rid of unwanted Items.
     *
     * Supports simple key-value objects which apply strict filters
     * as well as more elaborate greater-than ($gt) and less-than
     * ($lt) operators useful for numeric properties.
     *
     * @param filter
     * @returns void
     */
    findAndRemove(filter) {
        if (filter === undefined || typeof filter !== 'object') {
            return;
        }

        // console.log(_dupl)
        // console.log(this.getItems())

        // this is wrong!! don't alter an array
        // that you're iterating over...
        this.getItems().forEach( (item, itemKey) =>  {
            // let removeItem = false;

            Object.keys(filter).forEach( (filterKey) => {
                if (!item[filterKey]) {
                    return;
                }

                if (filter[filterKey] === item[filterKey]) {
                    item.remove = true;
                    return;
                }

                if (typeof filter[filterKey] === 'object') {
                    let filterVal = filter[filterKey];
                    let filterOperator = Object.keys(filterVal)[0];
                    let filterOperand  = filterVal[filterOperator];
                    let itemOperand    = item[filterKey];

                    if (filterOperator === '$gt') {
                        item.remove = itemOperand > filterOperand;
                    } else if (filterOperator === '$lt') {
                        item.remove = itemOperand < filterOperand;
                    }
                }

            });
        });

        let index = this.itemSet.length - 1;
        while (index >= 0) {
            if (this.itemSet[index].remove) {
                this.itemSet.splice(index, 1);
            }
            index -= 1;
        }
    }

    /**
     * Make sure that the FIFO Queue gets stringified nicely
     * if needed to be logged or printed to the stdout.
     *
     * @returns string
     */
    toString() {
        if (this.itemSet.length === 0) {
            return ' <empty> ';
        }

        let i = 0;
        let out = '';
        this.itemSet.forEach((item) => {
            out += ` [${item._id || item.id || i++}] `;
    });

        return `<-${out}<-`;
    }
}

module.exports = FifoQueue;