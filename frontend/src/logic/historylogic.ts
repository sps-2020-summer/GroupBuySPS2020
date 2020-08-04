import { Offer, getPastOffers } from "./offerlogic";
import { Request, getPastRequests } from "./requestlogic";
import { Task, getPastTasks } from "./tasklogic";

type history = {
  offers: Offer[],
  requests: Request[],
  tasks: Task[]
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
