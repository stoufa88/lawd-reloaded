import moment from 'moment';

let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

let CalendarUtils = {
	formatEventDate(day, time) {
		let date = moment();

		if(day == null) {
			day = moment().day();
		}else{
			day = Number.isInteger(day) ? day : days.indexOf(day) + 1;
		}
		date.set('day', day);

		let colonIndex = time.indexOf('"');
		let hour = time.slice(0, colonIndex - 2) === '00' ? '24' : time.slice(0, colonIndex - 2)
		date.set('hour', hour);
		date.set('minute', time.slice(colonIndex - 1));
		date.set('second', '00');
		date.set('millisecond', '00');
		return date;
	},

}

export default CalendarUtils;
