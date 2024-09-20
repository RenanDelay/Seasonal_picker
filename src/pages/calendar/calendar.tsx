// Importações padrões
import { useState, useEffect } from "react";

// Importando datas e lista de meses
import { month_list } from "../../data/month_list";
import { seazonal_dates } from "../../data/seasonal_dates";

// Importando outras funções
import getDates from "../../functions/get_date/getDate";
import { extractData } from "../../functions/seasonal_generator/seasonalGenerator";
import CalendarIcon from "../../img/calendar.svg";
import EmailForm from "../../functions/forms_c/Emailforms";

// Importando icones do React
import { MdArrowBackIosNew, MdArrowForwardIos, MdClose} from "react-icons/md";

// Importando estilo css
import "./calendar.css";

//definindo a exportação
export type listType = {
  name: string;
  date: Date;
};

export default function Calendar() {
  const [monthSelect, setMonthSelect] = useState(0);
  const [tag, setTag] = useState<string>("");
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
  const [selectAll, setSelectAll] = useState(false);

  // Função para checar se todas as datas de um determinado mes estão selecionadas
  const checkIfAllSelected = () => {
    const datesInMonth = getDates(366).filter(
      (date) => new Date(date).getMonth() === monthSelect
    );

    const allSeasonalDates = datesInMonth.flatMap((date) => {
      const month = new Date(date).getMonth();
      const seasonalData = extractData(seazonal_dates).find(
        (result) => result?.month_index === month
      )?.dates;
      return (
        seasonalData?.filter(
          (data) =>
            new Date(data.date).toLocaleDateString() ===
            new Date(date).toLocaleDateString()
        ) || []
      );
    });

    const allSelected = allSeasonalDates.every((data) =>
      list.some(
        (item) =>
          item.date.toLocaleDateString() ===
          new Date(data.date).toLocaleDateString()
      )
    );

    setSelectAll(allSelected);
  };

  // chama função de checar para chamar checkIfAllSelected
  useEffect(() => {
    checkIfAllSelected();
  }, [monthSelect, list]);

  const toggleSelectAll = () => {
    const datesInMonth = getDates(366).filter(
      (date) => new Date(date).getMonth() === monthSelect
    );

    if (selectAll) {
      setList((prevList) =>
        prevList.filter((item) =>
          !datesInMonth.some(
            (date) =>
              item.date.toLocaleDateString() ===
              new Date(date).toLocaleDateString()
          )
        )
      );
    } else {
      const allSeasonalDates = datesInMonth.flatMap((date) => {
        const month = new Date(date).getMonth();
        const seasonalData = extractData(seazonal_dates).find(
          (result) => result?.month_index === month
        )?.dates;
        return (
          seasonalData?.filter(
            (data) =>
              new Date(data.date).toLocaleDateString() ===
              new Date(date).toLocaleDateString()
          ) || []
        );
      });

      setList((prevList) => {
        const existingDates = new Set(
          prevList.map((item) => item.date.toLocaleDateString())
        );
        return [
          ...prevList,
          ...allSeasonalDates.filter(
            (data) =>
              !existingDates.has(
                new Date(data.date).toLocaleDateString()
              )
          ),
        ];
      });
    }
  };

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
                Abaixo você vai encontrar um calendário com todas as datas
                sazonais do ano.
                <br />
                Selecione as que você deseja realizar suas publicações nas
                redes sociais
              </p>
            </div>
          </div>
          <div className="p2_title">
            <div className="change_date">
              <div
                className="arrow_container"
                style={{
                  background: monthSelect === 0 ? "#f6f6f6" : "#FFDB4F",
                }}
                onClick={() => {
                  if (monthSelect !== 0) {
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
                  if (monthSelect !== 11) {
                    setMonthSelect(monthSelect + 1);
                  }
                }}
                className="arrow_container"
              >
                <MdArrowForwardIos />
              </div>
            </div>
            <div
              className="arrow_container"
              onClick={toggleSelectAll}
              style={{
                background: selectAll ? "#f6f6f6" : "#FFDB4F",
              }}
            >
              <p>{selectAll ? "Desselecionar Todos" : "Selecionar Todos"}</p>
            </div>
          </div>
        </div>
        <div className="calendar_content">
          <div className="calendar">
            <div className="week_days">
              {weekdays.map((res, i) => {
                return <p key={i}>{res.substring(0, 3)}</p>;
              })}
            </div>
            <div className="days">
              {getDates(366)
                .filter((date) => new Date(date).getMonth() === monthSelect)
                .map((date, i) => {
                  const month = new Date(date).getMonth();

                  let actual_month = extractData(seazonal_dates).find(
                    (result) => result?.month_index === month
                  )?.dates;
                  let seasonal_day = actual_month?.filter(
                    (data) =>
                      new Date(data.date).toLocaleDateString() ===
                      new Date(date).toLocaleDateString()
                  );
                  return (
                    <div className="container_day" key={i}>
                      <p>{new Date(date).getDate()}</p>
                      <div className="list_container">
                        {seasonal_day?.map((dataRes, inList) => {
                          return (
                            <div className="tags_container" key={inList}>
                              <p
                                className="tags_dates"
                                style={{
                                  background: "#FFDB4F",
                                  opacity: list.some(
                                    (res) => res.name === dataRes.name
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
                                      (res) => res.name === dataRes.name
                                    )
                                  ) {
                                    setList((list) => [...list, dataRes]);
                                  } else {
                                    setList((prevList) =>
                                      prevList.filter(
                                        (resul) =>
                                          resul.name !== dataRes.name
                                      )
                                    );
                                  }
                                }}
                              >
                                {dataRes.name.substring(0, 15)}
                                {dataRes.name.length >= 15 && "..."}
                              </p>
                              {dataRes.name === tag && (
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
                <div className="list_item" key={i}>
                  <p>
                    {res.name} ({new Date(res.date).toLocaleDateString()})
                  </p>
                  <MdClose
                    size={"16px"}
                    cursor={"pointer"}
                    onClick={() => {
                      setList((prevList) =>
                        prevList.filter(
                          (resul) => resul.name !== res.name
                        )
                      );
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <EmailForm list={list}/>
      </div>
    </div>
  );
}