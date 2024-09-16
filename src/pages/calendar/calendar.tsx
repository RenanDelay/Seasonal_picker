//Default imports
import { useState } from "react";

//Data
import { month_list } from "../../data/month_list";
import { seazonal_dates } from "../../data/seasonal_dates";

//Functions
import getDates from "../../functions/get_date/getDate";
import { extractData } from "../../functions/seasonal_generator/seasonalGenerator";

import CalendarIcon from "../../img/calendar.svg";

//Icons
import { MdArrowBackIosNew, MdArrowForwardIos, MdClose } from "react-icons/md";

//Style
import "./calendar.css";

export type listType = {
  name: string;
  date: Date;
};

export default function Calendar() {
  const [monthSelect, setMonthSelect] = useState(0);
  const [tag, setTag] = useState<string>("");
  //Variables
  const [weekdays, setWeekdays] = useState<string[]>([
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sabado",
    "Domingo",
  ]);
  const [colors, setColors] = useState<string[]>([
    "#FFCB00",
    "#FFDB4F",
    "#E7B800",
  ]);
  const [list, setList] = useState<listType[]>([]);
  return (
    <div className="background">
      <div className="content">
        <div className="_title">
          <div className="p1_title">
            <div className="icon_container">
              <img src={CalendarIcon} />
            </div>
            <div className="title_text">
              <h2>Datas sazonais</h2>
              <p>
                Abaixo você encontrar um calendário com todas as datas sazonais
                do ano.
                <br />
                Selecione as que você deseja realizar suas publicações nas redes
                sociais
              </p>
            </div>
          </div>
          <div className="p2_title">
            <div className="change_date">
              <div
                className="arrow_container"
                style={{
                  background: monthSelect == 0 ? "#f6f6f6" : "#FFDB4F",
                }}
                onClick={() => {
                  if (monthSelect != 0) {
                    setMonthSelect(monthSelect - 1);
                  }
                }}
              >
                <MdArrowBackIosNew />
              </div>
              <p>{month_list[monthSelect]}</p>
              <div
                style={{
                  background: monthSelect >= 11 ? "#f6f6f6" : "#FFDB4F",
                }}
                onClick={() => {
                  if (monthSelect != 11) {
                    setMonthSelect(monthSelect + 1);
                  }
                }}
                className="arrow_container"
              >
                <MdArrowForwardIos />
              </div>
            </div>
          </div>
        </div>
        <div className="calendar_content">
          <div className="calendar">
            <div className="week_days">
              {weekdays.map((res, i) => {
                return <p>{res.substring(0, 3)}</p>;
              })}
            </div>
            <div className="days">
              {getDates(366)
                .filter((res) => new Date(res).getMonth() == monthSelect)
                .map((res, i) => {
                  const month = new Date(res).getMonth();

                  let actual_month = extractData(seazonal_dates).find(
                    (result) => result?.month_index == month
                  )?.dates;
                  let seasonal_day = actual_month?.filter(
                    (result) =>
                      new Date(result.date).toLocaleDateString() ==
                      new Date(res).toLocaleDateString()
                  );
                  return (
                    <div className="container_day" key={i}>
                      <p>{new Date(res).getDate()}</p>
                      <div className="list_container">
                        {seasonal_day?.map((dataRes, inList) => {
                          return (
                            <div className="tags_container">
                              <p
                                className="tags_dates"
                                key={inList}
                                // title={dataRes.name}
                                style={{
                                  background: "#FFDB4F",
                                  opacity: list.some(
                                    (res) => res.name == dataRes.name
                                  )
                                    ? 0.5
                                    : 1,
                                }}
                                onMouseEnter={() => {
                                  setTag(dataRes?.name);
                                }}
                                onMouseLeave={() => {
                                  setTag("");
                                }}
                                onClick={() => {
                                  if (
                                    !list.some(
                                      (res) => res.name == dataRes.name
                                    )
                                  ) {
                                    setList((list) => [...list, dataRes]);
                                  }
                                  if (
                                    list.some((res) => res.name == dataRes.name)
                                  ) {
                                    const copy = list?.filter(
                                      (resul, index) =>
                                        resul.name !== dataRes.name
                                    );
                                    setList(copy);
                                  }
                                }}
                              >
                                {dataRes.name.substring(0, 15)}
                                {dataRes?.name.length >= 15 && "..."}
                              </p>
                              {dataRes?.name == tag && (
                                <p className="tag_description">{tag}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="forms"></div>
        </div>
      </div>
      <div className="forms">
        <div className="list">
          <div className="title">Titulo</div>
          <div className="list_dates">
            {list?.map((res, i) => {
              return (
                <div className="list_item">
                  <p>
                    {res.name} ({new Date(res.date).toLocaleDateString()})
                  </p>
                  <MdClose
                    size={"16px"}
                    cursor={"pointer"}
                    onClick={() => {
                      const copy = list?.filter(
                        (resul, index) => resul.name !== res.name
                      );
                      setList(copy);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
