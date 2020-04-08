const convertToDays = (periodType, time) => {
    const dayTime = 0;
  switch (periodType) {
    case 'weeks':
      dayTime = 7 * time;
      break;
    case 'months':
      dayTime = 30 * time;
      break;
    default:
      dayTime = 1 * time;
      break;
  }
  return dayTime;
};

const estimateInfectedAfterDays = (infected, periodType, time) => {
  const timeInDays = convertToDays(periodType, time);
  const daysFactor = timeInDays / 3;
  const estimatedAfterDays = infected * 2 ** daysFactor;
  return estimatedAfterDays;
};

const estimateHospitalBedsByTime = (severeCases, totalBeds) => {
  const availableBeds = 0.35 * totalBeds;
  if (availableBeds >= severeCases) return availableBeds;
  return availableBeds - severeCases;
};

const estimateDollarsInFlight = (infected, avgIncome, periodType, time) => {
  const timeInDays = convertToDays(periodType, time);
  return infected * 0.65 * avgIncome * timeInDays;
};

const getImpactData = (data) => {
  const impact = {};
  impact.currentlyInfected = data.reportedCases * 10;
  impact.infectionsByRequestedTime = estimateInfectedAfterDays(
    impact.currentlyInfected,
    data.periodType,
    data.timeToElapse
  );
  impact.severeCasesByRequestedTime = 0.15 * impact.infectionsByRequestedTime;
  impact.hospitalBedsByRequestedTime = estimateHospitalBedsByTime(
    impact.severeCasesByRequestedTime,
    data.totalHospitalBeds
  );
  impact.casesForICUByRequestedTime = 0.05 * impact.infectionsByRequestedTime;
  impact.casesForVentilatorsByRequestedTime = 0.02 * impact.infectionsByRequestedTime;
  impact.dollarsInFlight = estimateDollarsInFlight(
    impact.infectionsByRequestedTime,
    data.region.avgDailyIncomeInUSD,
    data.periodType,
    data.timeToElapse
  );
  return impact;
};

const getSevereImpactData = (data) => {
  const severeImpact = {};
  severeImpact.currentlyInfected = data.reportedCases * 50;
  severeImpact.infectionsByRequestedTime = estimateInfectedAfterDays(
    severeImpact.currentlyInfected,
    data.periodType,
    data.timeToElapse
  );
  severeImpact.severeCasesByRequestedTime = 0.15 * severeImpact.infectionsByRequestedTime;
  severeImpact.hospitalBedsByRequestedTime = estimateHospitalBedsByTime(
    severeImpact.severeCasesByRequestedTime,
    data.totalHospitalBeds
  );
  severeImpact.casesForICUByRequestedTime = 0.05 * severeImpact.infectionsByRequestedTime;
  severeImpact.casesForVentilatorsByRequestedTime = 0.02 * severeImpact.infectionsByRequestedTime;
  severeImpact.dollarsInFlight = estimateDollarsInFlight(
    severeImpact.infectionsByRequestedTime,
    data.region.avgDailyIncomeInUSD,
    data.periodType,
    data.timeToElapse
  );

  return severeImpact;
};

const covid19ImpactEstimator = (data) => {
  const impact = getImpactData(data);
  const severeImpact = getSevereImpactData(data);

  return { data, impact, severeImpact };
};

// console.log(covid19ImpactEstimator(inputData));

export default covid19ImpactEstimator;
