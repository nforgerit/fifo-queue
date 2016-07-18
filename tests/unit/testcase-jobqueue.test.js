const assert = require('chai').assert;
const _      = require('lodash');

describe('FifoQueue', () => {

   const FifoQueue = require('../..');

   it('loads as a callable Function', () => {
       assert.isFunction(FifoQueue, 'FifoQueue module.exports must be of type Function [constructor]');
   });

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

   describe('nicely prints its current state', () => {
       it('should print jobs with "id" property', () => {
           let jobQueue = new FifoQueue;

           let jobs = [{id: 1}, {id: 2}, {id: 3}];
           jobQueue.setItems(jobs);

           let expectedOutput = '<- [1]  [2]  [3] <-';
           let actualOutput   = String(jobQueue);

           assert.equal(actualOutput, expectedOutput);
       });

       it('should print items with "_id" property', () => {
           let jobQueue = new FifoQueue;

           let jobs = [{_id: 1}, {_id: 2}, {_id: 3}];
           jobQueue.setItems(jobs);

           let expectedOutput = '<- [1]  [2]  [3] <-';
           let actualOutput   = String(jobQueue);

           assert.equal(actualOutput, expectedOutput);
       });

       it('should print <empty> if queue is empty', () => {
           let jobQueue = new FifoQueue;

           let expectedOutput = ' <empty> ';
           let actualOutput   = String(jobQueue);

           assert.equal(actualOutput, expectedOutput);

       })
   });

   describe('filters the queue according to different filters', () => {
       it('should apply a strict property filter', () => {
           let jobQueue = new FifoQueue;
           let jobs = [
               {id: 1, title: 'do something fast',     retry: 0,   prio: 100   },
               {id: 2, title: 'i fail sometimes',      retry: 2,   prio: 23    },
               {id: 3, title: 'i can also fail',       retry: 1,   prio: 1010  },
               {id: 4, title: 'i fail often',          retry: 99,  prio: 87    },
               {id: 5, title: 'i fail therefore i am', retry: 999, prio: 9892  }
           ];
           jobQueue.setItems(jobs);

           jobQueue.findAndRemove({title: 'do something fast'});
           jobQueue.findAndRemove({title: 'i fail often'});

           assert.equal(jobQueue.getLength(), 3);
           assert.equal(String(jobQueue), '<- [2]  [3]  [5] <-');
       });

       it('should apply a $gt filter', () => {
           let jobQueue = new FifoQueue;
           let jobs = [
               {id: 1, title: 'do something fast',     retry: 0,   prio: 100   },
               {id: 2, title: 'i fail sometimes',      retry: 2,   prio: 23    },
               {id: 3, title: 'i can also fail',       retry: 1,   prio: 1010  },
               {id: 4, title: 'i fail often',          retry: 99,  prio: 87    },
               {id: 5, title: 'i fail therefore i am', retry: 999, prio: 9892  }
           ];

           jobQueue.setItems(jobs);
           jobQueue.findAndRemove({retry:{$gt: 10}});

           assert.equal(jobQueue.getLength(), 3);
           assert.equal(String(jobQueue), '<- [1]  [2]  [3] <-');
       });

       it('should apply a $lt property filter', () => {
           let jobQueue = new FifoQueue;
           let jobs = [
               {id: 1, title: 'do something fast',     retry: 0,   prio: 100   },
               {id: 2, title: 'i fail sometimes',      retry: 2,   prio: 23    },
               {id: 3, title: 'i can also fail',       retry: 1,   prio: 1010  },
               {id: 4, title: 'i fail often',          retry: 99,  prio: 87    },
               {id: 5, title: 'i fail therefore i am', retry: 999, prio: 9892  }
           ];

           jobQueue.setItems(jobs);

           jobQueue.findAndRemove({prio:{$lt: 1000}});

           assert.equal(jobQueue.getLength(), 2);
           assert.equal(String(jobQueue), '<- [3]  [5] <-');
       })
   })
});