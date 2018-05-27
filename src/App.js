import React, { Component } from 'react';
import './App.css';
import Paragraphs from "./Paragraphs/Paragraphs.js";

class App extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            selected: 1,
            paragraphs: this.paragraphs1
        };
    }

    paragraphs1 = [
        'Биткоин пошел по кругу',
        'Стоимость биткоина более чем за полгода сделала полный круг и в ближайшее время останется на уровне 8-10 тысяч долларов, полагают опрошенные Cointelegraph аналитики.',
    ];

    paragraphs2 = [
        'Роналду намекнул на уход из «Реала»',
        'Нападающий мадридского «Реала» Криштиану Роналду рассказал о будущем в спорте. Его слова приводит Associated Press.',
        '«О будущем будем говорить позднее. Мне было очень приятно играть за "Реал", а ответ я дам в ближайшие дни. Я наслаждался этим моментом с партнерами. Важно, что мы вместе сотворили историю. Спасибо всем болельщикам», — заявил форвард.',
        '«Реал» 27 мая стал победителем Лиги чемпионов, обыграв в решающем матче английский «Ливерпуль» со счетом 3:1. Победу сливочным принесли гол Карима Бензема и дубль Гарета Бейла.','Мадридский клуб выиграл Лигу чемпионов третий раз подряд и 13-й раз в истории. Роналду стал первым футболистом, выигрывавшим трофей пять раз за карьеру.',
        'Роналду перешел в «Реал» из английского «Манчестер Юнайтед» в июле 2009 года. В составе сливочных форвард дважды становился чемпионом Испании и четыре раза выиграл Лигу чемпионов.',
        'Больше важных новостей в Telegram-канале «Лента дня». Подписывайся!'
    ];

    paragraphs3 = [
        'Оценены шансы лидера сборной Египта сыграть на чемпионате мира',
    ];

    paragraphs4 = [

    ];

    paragraphs5 = [
        'Охранявших ядерное оружие американских военных обнаружили под ЛСД',
        'Группа американских военных, охраняющих ядерные ракеты на авиабазе Warren в штате Вайоминг, в течение года приобретала, распространяла и употребляла психоактивные вещества. В частности, речь идет об ЛСД, передает ABC News.',
        '«Несмотря на то что это звучит, как в кино, это вовсе не так», — приводит Associated Press слова прокурора, капитана Чарльза Гримсли (Charles Grimsley).',
        'Власти раскрыли преступную деятельность группировки весной 2016 года. В отношении 14 военных в общей сложности были приняты дисциплинарные меры. Известно, что шестеро из них употребляли галлюциногены сами, а также распространяли их. После того как началось расследование, один из них бежал в Мексику.',
        'В введении военнослужащих 90-го ракетного крыла находится треть из 400 ракет типа Minuteman III.',
        'Больше важных новостей в Telegram-канале «Лента дня». Подписывайся!'
    ];

    paragraphs6 = [
        'Над полями туман',
        'Над рекой туман',
        'Ты придешь не придешь',
        'Все одно - обман',
        'А на небе луна',
        'За ней звезд стена',
        'И над хутором песня слышна',
        'И идет паренек',
        'И ему невдомек',
        'То что завтра начнется война',
    ];

    toggle() {
        let selected;
        if (this.state.selected === 6) {
            selected = 1;
        } else {
            selected = this.state.selected + 1;
        }
        this.setState({
            selected,
            paragraphs: this[`paragraphs${selected}`]
        })
    }

    render() {
        return (
            <div className="container">
                <button
                    onClick={this.toggle}
                    className="btn-next"
                >
                    NEXT
                </button>

                <Paragraphs
                      paragraphs={this.state.paragraphs}
                      restrictedHeight={200}
                      lineHeight={24}
                      wrapperClassName="wrapper"
                      paragraphsClassName="paragraphs"
                      paragraphClassName="paragraph"
                      toggleClassName="toggle"
                      toggleShow={<button className="btn-show">SHOW</button>}
                      toggleHide={<button className="btn-hide">HIDE</button>}
                />

            </div>
        );
    }
}

export default App;
