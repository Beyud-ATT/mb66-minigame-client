export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const isWithinTimeRange = (startTime, endTime) => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = (currentHours * 60) + currentMinutes;
  
  // Convert start time to minutes
  const [startHour, startMinute] = startTime.split(':').map(num => parseInt(num, 10));
  const startTimeInMinutes = (startHour * 60) + startMinute;
  
  // Convert end time to minutes
  const [endHour, endMinute] = endTime.split(':').map(num => parseInt(num, 10));
  const endTimeInMinutes = (endHour * 60) + endMinute;

  // Handle time ranges that cross midnight
  if (endTimeInMinutes < startTimeInMinutes) {
    // If current time is after start time or before end time
    return currentTimeInMinutes >= startTimeInMinutes || currentTimeInMinutes <= endTimeInMinutes;
  }
  
  // Normal time range check
  return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
};


export const remainingTime = (timeRemaining) => {
  if (!timeRemaining || timeRemaining <= 0) return 0; 
  return Math.max(Math.floor(timeRemaining / 1000), 0);
};


export const calculateRemainingTime = (maxMinutes, endTime) => {
  const now = new Date();
  const [endHour, endMinute] = endTime.split(':').map(num => parseInt(num, 10));
  
  // Calculate end time today
  const endTimeDate = new Date();
  endTimeDate.setHours(endHour, endMinute, 0, 0);
  
  // Calculate time difference in seconds
  const timeUntilEnd = Math.floor((endTimeDate - now) / 1000);
  const maxTime = maxMinutes * 60; // Convert minutes to seconds
  
  // Return the minimum between maxTime and timeUntilEnd
  return Math.max(0, Math.min(maxTime, timeUntilEnd));
};
