// Importações padrões
import { useState, useEffect } from "react";

// Importando datas e lista de meses
import { month_list } from "../../data/month_list";
import { seazonal_dates } from "../../data/seasonal_dates";

// Importando outras funções
import getDates from "../../functions/get_date/getDate";
import { extractData } from "../../functions/seasonal_generator/seasonalGenerator";
import Logotipo from "../../img/logotipo.svg";
import Logotipow from "../../img/logotipow.svg";
import Banner from "../../img/banner1.png";

// Importando icones do React
import { MdArrowBackIosNew, MdArrowForwardIos, MdClose} from "react-icons/md";

// Importando estilo css
import "./helpers.css";
import "./header.css";
import "./footer.css";
import "./home.css";

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
    <div>
      <header className="header">
        <div className="container">
          <div className="navbar">
            <a href="#" className="logo">
              <img src={Logotipo} alt="" />
            </a>
            <div className="date">Set. - Otu. 2024</div>
            <div className="ba">
              <div className="bef"><svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 1L1.5 6L6.5 11" stroke="#565656"/></svg></div>
              <div className="aft"><svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 1L5.5 6L0.5 11" stroke="#565656"/></svg></div>
            </div>
            <div className="form">
              <input type="text" name="search" id="search" placeholder="Buscar uma data" />
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.49977 1.91687e-08C7.14436 0.000115492 5.80863 0.324364 4.60402 0.945694C3.39941 1.56702 2.36086 2.46742 1.575 3.57175C0.789144 4.67609 0.278775 5.95235 0.0864735 7.29404C-0.105828 8.63574 0.0255146 10.004 0.469544 11.2846C0.913572 12.5652 1.65741 13.7211 2.639 14.6557C3.62059 15.5904 4.81147 16.2768 6.11228 16.6576C7.41309 17.0384 8.78611 17.1026 10.1168 16.8449C11.4475 16.5872 12.6972 16.015 13.7618 15.176L17.4138 18.828C17.6024 19.0102 17.855 19.111 18.1172 19.1087C18.3794 19.1064 18.6302 19.0012 18.8156 18.8158C19.001 18.6304 19.1062 18.3796 19.1084 18.1174C19.1107 17.8552 19.0099 17.6026 18.8278 17.414L15.1758 13.762C16.1638 12.5086 16.7789 11.0024 16.9509 9.41573C17.1228 7.82905 16.8446 6.22602 16.148 4.79009C15.4514 3.35417 14.3646 2.14336 13.0121 1.29623C11.6595 0.449106 10.0957 -0.000107143 8.49977 1.91687e-08ZM1.99977 8.5C1.99977 6.77609 2.68458 5.12279 3.90357 3.90381C5.12256 2.68482 6.77586 2 8.49977 2C10.2237 2 11.877 2.68482 13.096 3.90381C14.3149 5.12279 14.9998 6.77609 14.9998 8.5C14.9998 10.2239 14.3149 11.8772 13.096 13.0962C11.877 14.3152 10.2237 15 8.49977 15C6.77586 15 5.12256 14.3152 3.90357 13.0962C2.68458 11.8772 1.99977 10.2239 1.99977 8.5Z" fill="#E0E0E0"/></svg>
            </div>
            <div className="navbar-toggler"></div>
          </div>
        </div>
      </header>
      <div className="banners">
        <img src={Banner} alt="" />
        <div className="scroll"></div>
      </div>
      <section className="dates">
        <div className="ads">
          <div className="ad"></div>
          <div className="ad"></div>
        </div>
        <div className="container">
          <div className="table">
            <div className="wds">
              <div>SEG.</div>
              <div className="active">TER.</div>
              <div>QUA.</div>
              <div>QUI.</div>
              <div>SEX.</div>
              <div>SAB.</div>
              <div>DOM.</div>
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
                            <div className={`tags_container ${list.some(
                              (res) => res.name == dataRes.name
                            )
                              ? "active"
                              : ""}`}  onMouseEnter={() => {
                              setTag(dataRes?.name);
                            }}
                            onMouseLeave={() => {
                              setTag("");
                            }}>
                              <p
                                className="tags_dates"
                                key={inList}
                                // title={dataRes.name}
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
        </div>
        <div className="ads">
          <div className="ad"></div>
          <div className="ad"></div>
        </div>
      </section>
      <section className="minf">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="datepicker">
                <div className="top">
                  <div className="bef"><svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1.5L1.5 9L9 16.5" stroke="#939393" stroke-width="2"/></svg></div>
                  <div className="title">Outubro de 2024</div>
                  <div className="aft"><svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L8.5 9L1 16.5" stroke="#939393" stroke-width="2"/></svg></div>
                </div>
                <div className="dates">
                  <div className="wd">
                    <div>Se</div>
                    <div>Te</div>
                    <div>Qu</div>
                    <div>Qu</div>
                    <div>Se</div>
                    <div>Sa</div>
                    <div>Do</div>
                  </div>
                  <div className="days">
                    {
                      Array.from({length:31}).map((res,i)=>{
                        return (<div>{i+1}</div>)
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="selected_dates">
                <div className="title">Datas Selecionadas</div>
                <div className="dts">
                    {
                      Array.from({length:13}).map((res,i)=>{
                        return (<div>
                          <p>Dia do Saci</p>
                          <div className="rm">⨉</div>
                        </div>)
                      })
                    }
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="box">
                <div className="mailtypes">
                  <div className="mailtype">
                    <div className="title">E-mail Usuário</div>
                    <div className="df">
                      <input type="text" name="email" id="email" placeholder="Escrever e-mail" />
                      <div className="add">Adicionar</div>
                    </div>
                    <div className="list">
                      <div className="mail">
                        <p>Tete123@email.com.br</p>
                        <div className="rm">⨉</div>
                      </div>
                      <div className="mail">
                        <p>Tete123@email.com.br</p>
                        <div className="rm">⨉</div>
                      </div>
                    </div>
                  </div>
                  <div className="mailtype">
                    <div className="title">E-mails contribuentes</div>
                    <div className="df">
                      <input type="text" name="email" id="email" placeholder="Escrever e-mail" />
                      <div className="add">Adicionar</div>
                    </div>
                    <div className="list">
                      <div className="mail">
                        <p>Tete123@email.com.br</p>
                        <div className="rm">⨉</div>
                      </div>
                      <div className="mail">
                        <p>Tete123@email.com.br</p>
                        <div className="rm">⨉</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="send">Enviar Datas</div>
              </div>
            </div>
            <div className="col-12">
              <div className="ad"></div>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <div className="container">
          <a href="#" className="logo">
            <img src={Logotipow} alt="" />
          </a>
          <div className="df">
            <a href="tel:550000000000" className="telp">(00) 0000-0000</a>
            <div className="rss">
              <a href="#" target="_blank" className="rs"><svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.14552 10.3016H8.31436L9.1819 6.83148H6.14552V5.09641C6.14552 4.20284 6.14552 3.36133 7.88059 3.36133H9.1819V0.446406C8.89908 0.409102 7.83114 0.324951 6.70334 0.324951C4.34798 0.324951 2.67537 1.76246 2.67537 4.40238V6.83148H0.0727539V10.3016H2.67537V17.6757H6.14552V10.3016Z" fill="white"/></svg></a>
              <a href="#" target="_blank" className="rs"><svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.93846 0.325195H13.2258C16.0019 0.325195 18.2575 2.58079 18.2575 5.35691V12.6442C18.2575 13.9787 17.7274 15.2586 16.7837 16.2022C15.8401 17.1458 14.5603 17.6759 13.2258 17.6759H5.93846C3.16234 17.6759 0.906738 15.4203 0.906738 12.6442V5.35691C0.906738 4.02242 1.43686 2.74258 2.38049 1.79895C3.32412 0.855321 4.60396 0.325195 5.93846 0.325195ZM5.76495 2.06027C4.93664 2.06027 4.14226 2.38931 3.55656 2.97502C2.97086 3.56072 2.64181 4.3551 2.64181 5.1834V12.8177C2.64181 14.5441 4.03855 15.9409 5.76495 15.9409H13.3993C14.2276 15.9409 15.022 15.6118 15.6077 15.0261C16.1934 14.4404 16.5224 13.646 16.5224 12.8177V5.1834C16.5224 3.45701 15.1257 2.06027 13.3993 2.06027H5.76495ZM14.1367 3.36158C14.4243 3.36158 14.7001 3.47583 14.9035 3.6792C15.1069 3.88256 15.2211 4.15839 15.2211 4.446C15.2211 4.7336 15.1069 5.00943 14.9035 5.2128C14.7001 5.41617 14.4243 5.53042 14.1367 5.53042C13.8491 5.53042 13.5732 5.41617 13.3699 5.2128C13.1665 5.00943 13.0523 4.7336 13.0523 4.446C13.0523 4.15839 13.1665 3.88256 13.3699 3.6792C13.5732 3.47583 13.8491 3.36158 14.1367 3.36158ZM9.58211 4.66288C10.7325 4.66288 11.8358 5.11989 12.6493 5.93336C13.4628 6.74684 13.9198 7.85014 13.9198 9.00057C13.9198 10.151 13.4628 11.2543 12.6493 12.0678C11.8358 12.8813 10.7325 13.3383 9.58211 13.3383C8.43169 13.3383 7.32838 12.8813 6.5149 12.0678C5.70143 11.2543 5.24443 10.151 5.24443 9.00057C5.24443 7.85014 5.70143 6.74684 6.5149 5.93336C7.32838 5.11989 8.43169 4.66288 9.58211 4.66288ZM9.58211 6.39796C8.89186 6.39796 8.22987 6.67216 7.74179 7.16024C7.2537 7.64833 6.9795 8.31031 6.9795 9.00057C6.9795 9.69082 7.2537 10.3528 7.74179 10.8409C8.22987 11.329 8.89186 11.6032 9.58211 11.6032C10.2724 11.6032 10.9344 11.329 11.4224 10.8409C11.9105 10.3528 12.1847 9.69082 12.1847 9.00057C12.1847 8.31031 11.9105 7.64833 11.4224 7.16024C10.9344 6.67216 10.2724 6.39796 9.58211 6.39796Z" fill="white"/></svg></a>
              <a href="#" target="_blank" className="rs"><svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.4611 0.472168H16.0152L10.4352 6.8503L17 15.5278H11.86L7.83462 10.2642L3.22765 15.5278H0.672232L6.64089 8.70544L0.343262 0.472862H5.61372L9.25252 5.28388L13.4611 0.472168ZM12.5651 13.9995H13.9803L4.84474 1.92061H3.3262L12.5651 13.9995Z" fill="white"/></svg></a>
            </div>
          </div>
          <div className="rights">© SeasonFlow 2024. Todos os direitos reservados.</div>
        </div>
      </footer>
    </div>
  );
}