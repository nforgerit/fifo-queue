const AbstractQueue = require('abstract-queue');

/**
 * JobQueue using FIFO strategy.
 */
class FifoQueue extends AbstractQueue {

    constructor(items) {
        super();
        this.itemSet = items || [];
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
}

module.exports = FifoQueue;
