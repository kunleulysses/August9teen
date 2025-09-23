const FPQ = require('fastpriorityqueue');

module.exports.createQueue = (comparator) => {
  const q = new FPQ(comparator);
  q.updatePriority = (item, newScore) => {
    item.__score = newScore;
    q.heapify(q.size);
  };
  q.pop = q.poll.bind(q);
  q.push = q.add.bind(q);
  return q;
};
