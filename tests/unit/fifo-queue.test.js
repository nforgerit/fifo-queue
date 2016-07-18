const assert = require('chai').assert;
const _ = require('lodash');

describe('FifoQueue', () => {

   const FifoQueue = require('../..');

    it('adds an item through its setter', () => {
       let jobQueue = new FifoQueue;

       let job = {
          id: 666,
          title: 'doThis'
       };

       jobQueue.addItem(job);
       assert.isTrue(jobQueue.hasItem());
       assert.equal(jobQueue.getLength(), 1);
    });

    it('removes jobs after acquiring them', () => {
        let jobQueue = new FifoQueue;

        let jobs = [{id: 1}, {id: 2}, {id: 3}];
        jobQueue.setItems(_.clone(jobs));

        let nextJob = jobQueue.next();

        assert.isTrue(jobQueue.hasItem());
        assert.equal(jobQueue.getLength(), 2);
        assert.equal(nextJob, jobs[0]);
        assert.sameMembers(jobQueue.getItems(), jobs.splice(1));
    });
});