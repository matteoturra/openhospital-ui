import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';
import ic_back from './ic_back.svg';
import ic_forward from './ic_forward.svg';

const config = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    month_subs: ['Jan', 'Feb', 'Apr', 'Mar', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    weeks: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    week_subs: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
    today: function() {
      return new Date();
    }
}
const TODAY = config.today();

class Calendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: config.today(),
      selected: config.today(),
      ldom: 30
    };
  }

  componentWillMount() {
    this.updateMonth(0);
  }

  updateMonth(add) {
    var d = this.state.current;
    d.setMonth(d.getMonth() + add);
    var eom = new Date(d.getYear(), d.getMonth() + 1, 0).getDate();
    this.setState({
      current: d,
      ldom: eom
    });
  }

  prev() {
    this.updateMonth(-1);
  }

  next() {
    this.updateMonth(1);
  }

  _onDatePicked(month, day) {
    var d = new Date(this.state.current.getTime());
    d.setMonth(d.getMonth() + month);
    d.setDate(day);
    this.props.onDatePicked(d);
    this.setState({
      selected: d
    });
  }

  renderDay(opts={}) {
    var baseClasses = "day noselect";
    var today = "";
    var todayStyle = {};
    var containerStyle = {};
    if( opts.today ) {
      today = "current";
      todayStyle = {
        borderColor: this.props.accentColor,
      };
    }

    var selected = "";
    var selectedStyle = {};
    if( opts.selected ) {
      selected = "selected";
      selectedStyle = {
        backgroundColor: this.props.accentColor
      }
      containerStyle = {
        color: '#ffffff'
      }
    }

    baseClasses += opts.current ? "" : " non-current";

    return (<div className={baseClasses}
                style={containerStyle}>
              <div className={today} style={todayStyle}></div>
              <div className={selected} style={selectedStyle}></div>
              <p onClick={ (ev) => {
                var day = ev.target.innerHTML;
                this._onDatePicked(opts.month, day);
              }}>{opts.date.getDate()}</p>
            </div>);
  }

  renderDays(copy) {
    var days = [];

    // set to beginning of month
    copy.setDate(1);

    // if we are missing no offset, include the previous week
    var offset = copy.getDay() === 0 ? 7 : copy.getDay();

    copy.setDate(-offset);

    var inMonth = false;
    var lastMonth = true;
    for (var i = 0; i < 42; i++) {
      // increase date
      copy.setDate(copy.getDate() + 1);

      // make sure we pass any previous month values
      if (i < 30 && copy.getDate() === 1) {
        inMonth = true;
        lastMonth = false;
      }
      // if we are seeing the '1' again, we have iterated over
      // the current month
      else if (i > 30 && copy.getDate() === 1) {
        inMonth = false;
      }

      var sel = new Date(this.state.selected.getTime());
      var isSelected = (sel.getFullYear() === copy.getFullYear() &&
          sel.getDate() === copy.getDate() &&
          sel.getMonth() === copy.getMonth());

      var isToday = (TODAY.getFullYear() === copy.getFullYear() &&
          TODAY.getDate() === copy.getDate() &&
          TODAY.getMonth() === copy.getMonth());

      days.push(this.renderDay({
        today: isToday,
        selected: isSelected,
        current: inMonth,
        month: (inMonth ? 0 : (lastMonth ? -1 : 1)),
        date: copy
      }));
    }

    return days;
  }

  renderHeaders() {
    var header = [];

    for (var i = 0; i < config.week_subs.length; i++) {
      header.push(<p className='day-headers noselect'>
                    {config.week_subs[i]}
                  </p>);
    }

    return header;
  }

  render() {
    // get su-sat header
    var header = this.renderHeaders();

    // copy our current time state
    var copy = new Date(this.state.current.getTime());

    // get the month days
    var days = this.renderDays(copy);

    var tMonth = config.months[this.state.selected.getMonth()];
    var tDate = this.state.selected.getDate();
    var tWeekDay = config.weeks[this.state.selected.getDay()];
    var month = config.months[this.state.current.getMonth()];
    var year = this.state.current.getFullYear();
    var date = this.state.current.getDate();

    var upperDate = null;
    if( this.props.showHeader ) {
      upperDate = (<div className='header center'>
        <p className="header-month">Today</p>
        <p className="header-month">{tMonth} {tDate}</p>
        <p className="header-month">{tWeekDay}</p>
        <p className="header-month">{year}</p>
        {/* <p className="header-day">{tDate}</p> */}
      </div>);
    }
    return (<div className="calendar-container">
    {/* return (<div className={this.props.orientation}> */}
      {upperDate}
      <div className="calendar">
        <div className='month'>
          <img className="month-arrow-left" src={ic_back} alt="back" onClick={this.prev.bind(this)}></img>
          <p className="month-title">{month}<br/>
          <span className="month-year">{year}</span>
          </p>
          <img className="month-arrow-right" src={ic_forward} alt="forward" onClick={this.next.bind(this)}></img>
        </div>
        <div className='footer'>
          {header}
          {days}
        </div>
      </div>
    </div>);
  }

};

Calendar.propTypes = {
  accentColor: PropTypes.string,
  onDatePicked: PropTypes.func,
  showHeader: PropTypes.bool,
  // orientation: PropTypes.string,
};

Calendar.defaultProps = {
  accentColor: '#00C1A6',
  onDatePicked: function(){},
  showHeader: true,
  // orientation: 'flex-col'
};

export default Calendar;
