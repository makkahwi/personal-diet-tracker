import moment from "moment";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";

import * as BeAPI from "../../../API";
import PageSection from "../../../Components/PageView/PageSection";
import { consumptionProps } from "../Diet/Consumption";
import { SchedulesMealElementProps } from "../Diet/Schedule/Elements";
import { SchedulesMealProps } from "../Diet/Schedule/Meals";
import { wateringProps } from "../Diet/Watering";
import { medicineProps } from "../Medicine";
import { sleepCycleProps } from "../SleepCycles";
import { walkExerciseProps } from "../Sports";
import WeeklyCalendar, { SummaryProps } from "./WeeklyCalendar";

const Dashboard = () => {
  const [consumptionData, setConsumptionData] = useState<consumptionProps[]>(
    []
  );
  const [walkExercisesData, setWalkExercisesData] = useState<
    walkExerciseProps[]
  >([]);
  const [medicineData, setMedicineData] = useState<medicineProps[]>([]);

  const [scheduled, setScheduled] = useState<SchedulesMealElementProps[]>([]);
  const [summaries, setSummaries] = useState<SummaryProps[]>([]);
  const [sleepCyclesData, setSleepCyclesData] = useState<sleepCycleProps[]>([]);
  const [meals, setMeals] = useState<SchedulesMealProps[]>([]);
  const [watering, setWatering] = useState<wateringProps[]>([]);

  const getData = () => {
    BeAPI.getAll("scheduleMealElements")
      .then((res: SchedulesMealElementProps[]) =>
        setScheduled(res?.sort((a, b) => (a.element > b.element ? 1 : -1)))
      )
      .catch((err) => console.log({ err }));

    BeAPI.getAll("watering")
      .then((res: wateringProps[]) =>
        setWatering(
          res?.sort((a: wateringProps, b: wateringProps) =>
            a.timestamp > b.timestamp ? -1 : 1
          )
        )
      )
      .catch((err) => console.log({ err }));

    BeAPI.getAll("scheduleMeals")
      .then((res: SchedulesMealProps[]) =>
        setMeals(
          res
            .sort((a: SchedulesMealProps, b: SchedulesMealProps) =>
              a.time < b.time ? -1 : 1
            )
            .sort((a: SchedulesMealProps, b: SchedulesMealProps) =>
              a.schedule < b.schedule ? 1 : -1
            )
        )
      )
      .catch((err) => console.log({ err }));

    BeAPI.getAll("consumed")
      .then((res: consumptionProps[]) =>
        setConsumptionData(
          res
            ?.sort((a: any, b: any) => (a.timestamp > b.timestamp ? -1 : 1))
            ?.map(({ contents, supposed, ...rest }) => ({
              ...rest,
              contents: contents?.sort((a, b) =>
                a.element > b.element ? 1 : -1
              ),
              supposed: supposed?.sort((a, b) =>
                a.element > b.element ? 1 : -1
              ),
            }))
        )
      )
      .catch((err) => console.log({ err }));

    BeAPI.getAll("sportSessions")
      .then((res: any) =>
        setWalkExercisesData(
          res?.sort((a: walkExerciseProps, b: walkExerciseProps) =>
            a.date > b.date ? -1 : 1
          )
        )
      )
      .catch((err) => console.log({ err }));

    BeAPI.getAll("sleepCycles")
      .then((res: any) =>
        setSleepCyclesData(
          res?.sort((a: sleepCycleProps, b: sleepCycleProps) =>
            a.startTime > b.startTime ? -1 : 1
          )
        )
      )
      .catch((err) => console.log({ err }));

    BeAPI.getAll("medicine")
      .then((res: any) =>
        setMedicineData(
          res?.sort((a: medicineProps, b: medicineProps) =>
            a.date > b.date ? -1 : 1
          )
        )
      )
      .catch((err) => console.log({ err }));

    BeAPI.getAll("summaries")
      .then((res: SummaryProps[]) =>
        setSummaries(
          res
          // ?.sort((a, b) => (a.element > b.element ? 1 : -1))
        )
      )
      .catch((err) => console.log({ err }));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <PageSection title="Dashboard">
      <Fragment>
        <WeeklyCalendar
          consumptionData={consumptionData.map((row) => {
            const mealId = meals.find(({ id }) => (id || "") === row.meal)?.id;

            return {
              ...row,
              supposed: scheduled.filter(({ meal }) => (meal || "") === mealId),
              meal: meals.find(({ id }) => row.meal === id) || {
                id: "string",
                schedule: 0,
                meal: "string",
                time: "string",
              },
            };
          })}
          watering={watering}
          walkExercisesData={walkExercisesData}
          medicineData={medicineData}
          sleepCyclesData={sleepCyclesData}
          summaries={summaries}
        />
      </Fragment>
    </PageSection>
  );
};

export default Dashboard;
