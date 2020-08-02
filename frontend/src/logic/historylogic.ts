import { PastOffers, getPastOffers } from "./offerlogic";
import { PastRequests, getPastRequests } from "./requestlogic";
import { PastTasks, getPastTasks } from "./tasklogic";

type history = {
  offers: PastOffers,
  requests: PastRequests,
  tasks: PastTasks
}

/**
 * Returns user history, i.e. all tasks, requests and offers that have "past".
 * @param uid ID of user, whose history is to be retrieved.
 */
export const getHistory: (
  uid: string
) => Promise<history> = async (
  uid
) => {
  const pastOffers = getPastOffers(uid);
  const pastRequests = getPastRequests(uid);
  const pastTasks = getPastTasks(uid);
  
  const history = Promise.all([
    pastOffers,
    pastRequests,
    pastTasks
  ])
  .then(items => (
    {
      offers: items[0],
      requests: items[1],
      tasks: items[2]
    }
  ))

  return history;
}
