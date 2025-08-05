const FPQ = require('fastpriorityqueue');

module.exports.createQueue = (comparator) => {
  const q = new FPQ(comparator);
  q.updatePriority = (item, newScore) => {
    item.__score = newScore;
    q.heapify();
  };
  return q;
};