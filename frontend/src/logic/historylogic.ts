import { PastOffers, getPastOffers } from "./offerlogic";

type history = {
  offers: PastOffers,
  requests: PastRequests,
  tasks: PastTasks
}

export const getHistory: (
  uid: string
) => Promise<history> = async (
  uid
) => {
  const pastOffers = await getPastOffers(uid);
  // TODO: complete
}
