
const filterAndSortTrains = (trains) => {
    const now = new Date();
    const next12Hours = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    const filteredTrains = trains.filter((train) => {
      const departureTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        train.departureTime.Hours,
        train.departureTime.Minutes,
        train.departureTime.Seconds
      );
      return departureTime > now && departureTime < next12Hours;
    });
  
    return filteredTrains.sort((a, b) => {
      if (a.price.AC !== b.price.AC) {
        return a.price.AC - b.price.AC;
      } else if (a.seatsAvailable.AC !== b.seatsAvailable.AC) {
        return b.seatsAvailable.AC - a.seatsAvailable.AC; 
      } else {
        const aDelay = a.delayedBy || 0;
        const bDelay = b.delayedBy || 0;
        const aDepartureTime = getAdjustedDepartureTime(a, aDelay);
        const bDepartureTime = getAdjustedDepartureTime(b, bDelay);
        return bDepartureTime - aDepartureTime; 
      }
    });
  };
  
  
  const getAdjustedDepartureTime = (train, delay) => {
    const departureTime = new Date();
    departureTime.setHours(train.departureTime.Hours);
    departureTime.setMinutes(train.departureTime.Minutes);
    departureTime.setSeconds(train.departureTime.Seconds);
    departureTime.setMinutes(departureTime.getMinutes() + delay);
    return departureTime;
  };