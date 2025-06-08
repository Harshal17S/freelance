/**
 * Calendar - A pure JavaScript calendar component with date and time selection
 */
class Calendar {
  /**
   * Create a new calendar component
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    // Default options
    this.options = {
      container: null,
      minDate: null,
      maxDate: null,
      minTime: '00:00',
      maxTime: '23:59',
      initialDate: new Date(),
      onSelect: null,
      ...options
    };

    // Internal state
    this.selectedDate = this.options.initialDate;
    this.currentMonth = new Date(this.selectedDate);
    this.currentMonth.setDate(1);
    this.selectedHours = this.selectedDate.getHours();
    this.selectedMinutes = this.selectedDate.getMinutes();
    
    // DOM elements
    this.element = null;
    this.calendarElement = null;
    this.timePickerElement = null;
    
    // Initialize component
    this.init();
  }

  /**
   * Initialize the calendar
   */
  init() {
    this.createStyles();
    this.createElements();
    this.render();
    
    if (this.options.container) {
      this.options.container.appendChild(this.element);
    }
  }

  /**
   * Create required styles
   */
  createStyles() {
    if (document.getElementById('calendar-component-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'calendar-component-styles';
    styleElement.textContent = `
      .calendar-component {
        font-family: Arial, sans-serif;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 300px;
      }
      
      .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f8f9fa;
        padding: 10px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      
      .calendar-header button {
        border: none;
        background-color: transparent;
        cursor: pointer;
        font-size: 16px;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      
      .calendar-header button:hover {
        background-color: #e9ecef;
      }
      
      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
        padding: 10px;
      }
      
      .day-header {
        text-align: center;
        font-weight: bold;
        margin-bottom: 5px;
        font-size: 12px;
        color: #6c757d;
      }
      
      .calendar-day {
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
      }
      
      .calendar-day span {
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
      }
      
      .calendar-day:not(.disabled):hover span {
        background-color: #e9ecef;
      }
      
      .calendar-day.selected span {
        background-color: #007bff;
        color: white;
      }
      
      .calendar-day.today span {
        border: 1px solid #007bff;
      }
      
      .calendar-day.disabled {
        color: #ced4da;
        cursor: not-allowed;
      }
      
      .calendar-day.other-month {
        color: #adb5bd;
      }
      
      .time-picker {
        padding: 15px;
        border-top: 1px solid #e9ecef;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
      }
      
      .time-picker select {
        padding: 5px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 14px;
        width: 60px;
      }
    `;
    
    document.head.appendChild(styleElement);
  }

  /**
   * Create DOM elements
   */
  createElements() {
    this.element = document.createElement('div');
    this.element.className = 'calendar-component';
    
    this.calendarElement = document.createElement('div');
    this.calendarElement.className = 'calendar-body';
    
    this.timePickerElement = document.createElement('div');
    this.timePickerElement.className = 'time-picker';
    
    this.element.appendChild(this.calendarElement);
    this.element.appendChild(this.timePickerElement);
  }

  /**
   * Render the calendar
   */
  render() {
    this.renderCalendar();
    this.renderTimePicker();
  }

  /**
   * Render calendar header and grid
   */
  renderCalendar() {
    this.calendarElement.innerHTML = '';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'calendar-header';
    
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&lt;';
    prevBtn.addEventListener('click', () => this.prevMonth());
    
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&gt;';
    nextBtn.addEventListener('click', () => this.nextMonth());
    
    const title = document.createElement('div');
    title.textContent = this.formatMonthYear();
    
    header.appendChild(prevBtn);
    header.appendChild(title);
    header.appendChild(nextBtn);
    
    // Create grid
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    
    // Add day headers
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    dayNames.forEach(name => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'day-header';
      dayHeader.textContent = name;
      grid.appendChild(dayHeader);
    });
    
    // Add days
    this.renderDays(grid);
    
    // Add elements to calendar
    this.calendarElement.appendChild(header);
    this.calendarElement.appendChild(grid);
  }

  /**
   * Render calendar days
   */
  renderDays(grid) {
    const today = new Date();
    const firstDay = new Date(this.currentMonth);
    const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0).getDate();
    const prevMonthLastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 0).getDate();
    const startingDay = firstDay.getDay();
    
    // Previous month days
    for (let i = 0; i < startingDay; i++) {
      const day = document.createElement('div');
      day.className = 'calendar-day disabled other-month';
      const span = document.createElement('span');
      span.textContent = prevMonthLastDay - startingDay + i + 1;
      day.appendChild(span);
      grid.appendChild(day);
    }
    
    // Current month days
    for (let i = 1; i <= lastDay; i++) {
      const day = document.createElement('div');
      day.className = 'calendar-day';
      
      const currentDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i);
      
      // Check if date is disabled
      const isDisabled = (this.options.minDate && currentDate < this.options.minDate) || 
                         (this.options.maxDate && currentDate > this.options.maxDate);
      
      if (isDisabled) {
        day.classList.add('disabled');
      } else {
        day.addEventListener('click', () => this.selectDate(currentDate));
      }
      
      // Check if date is today
      const isToday = today.getDate() === i && 
                      today.getMonth() === this.currentMonth.getMonth() && 
                      today.getFullYear() === this.currentMonth.getFullYear();
      
      if (isToday) {
        day.classList.add('today');
      }
      
      // Check if date is selected
      const isSelected = this.selectedDate.getDate() === i && 
                         this.selectedDate.getMonth() === this.currentMonth.getMonth() && 
                         this.selectedDate.getFullYear() === this.currentMonth.getFullYear();
      
      if (isSelected) {
        day.classList.add('selected');
      }
      
      const span = document.createElement('span');
      span.textContent = i;
      day.appendChild(span);
      grid.appendChild(day);
    }
    
    // Next month days
    const totalCells = 42;
    const remainingCells = totalCells - (startingDay + lastDay);
    
    for (let i = 1; i <= remainingCells; i++) {
      const day = document.createElement('div');
      day.className = 'calendar-day disabled other-month';
      const span = document.createElement('span');
      span.textContent = i;
      day.appendChild(span);
      grid.appendChild(day);
    }
  }

  /**
   * Render time picker
   */
  renderTimePicker() {
    this.timePickerElement.innerHTML = '';
    
    const label = document.createElement('span');
    label.textContent = 'Time:';
    
    // Create hour select
    const hourSelect = document.createElement('select');
    for (let i = 0; i < 24; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i.toString().padStart(2, '0');
      
      // Check if this hour is disabled
      const minHour = parseInt(this.options.minTime.split(':')[0]);
      const maxHour = parseInt(this.options.maxTime.split(':')[0]);
      const isMinDate = this.isSelectedDateMinDate();
      const isMaxDate = this.isSelectedDateMaxDate();
      
      const isDisabled = (isMinDate && i < minHour) || (isMaxDate && i > maxHour);
      
      if (isDisabled) {
        option.disabled = true;
      }
      
      if (i === this.selectedHours) {
        option.selected = true;
      }
      
      hourSelect.appendChild(option);
    }
    
    hourSelect.addEventListener('change', (e) => {
      this.selectedHours = parseInt(e.target.value);
      this.updateSelection();
    });
    
    const separator = document.createElement('span');
    separator.textContent = ':';
    
    // Create minute select
    const minuteSelect = document.createElement('select');
    for (let i = 0; i < 60; i += 5) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i.toString().padStart(2, '0');
      
      // Check if this minute is disabled
      const [minHours, minMinutes] = this.options.minTime.split(':').map(Number);
      const [maxHours, maxMinutes] = this.options.maxTime.split(':').map(Number);
      
      const isMinDate = this.isSelectedDateMinDate();
      const isMaxDate = this.isSelectedDateMaxDate();
      const isMinHour = this.selectedHours === minHours;
      const isMaxHour = this.selectedHours === maxHours;
      
      const isDisabled = (isMinDate && isMinHour && i < minMinutes) || 
                         (isMaxDate && isMaxHour && i > maxMinutes);
      
      if (isDisabled) {
        option.disabled = true;
      }
      
      // Find closest 5-minute interval for selected minutes
      const closestMinute = Math.round(this.selectedMinutes / 5) * 5;
      if (i === closestMinute) {
        option.selected = true;
      }
      
      minuteSelect.appendChild(option);
    }
    
    minuteSelect.addEventListener('change', (e) => {
      this.selectedMinutes = parseInt(e.target.value);
      this.updateSelection();
    });
    
    // Add elements to time picker
    this.timePickerElement.appendChild(label);
    this.timePickerElement.appendChild(hourSelect);
    this.timePickerElement.appendChild(separator);
    this.timePickerElement.appendChild(minuteSelect);
  }

  /**
   * Check if selected date is the minimum date
   */
  isSelectedDateMinDate() {
    if (!this.options.minDate) return false;
    
    return this.selectedDate.getFullYear() === this.options.minDate.getFullYear() &&
           this.selectedDate.getMonth() === this.options.minDate.getMonth() &&
           this.selectedDate.getDate() === this.options.minDate.getDate();
  }

  /**
   * Check if selected date is the maximum date
   */
  isSelectedDateMaxDate() {
    if (!this.options.maxDate) return false;
    
    return this.selectedDate.getFullYear() === this.options.maxDate.getFullYear() &&
           this.selectedDate.getMonth() === this.options.maxDate.getMonth() &&
           this.selectedDate.getDate() === this.options.maxDate.getDate();
  }

  /**
   * Select a date
   */
  selectDate(date) {
    this.selectedDate = new Date(date);
    this.updateSelection();
    this.render();
  }

  /**
   * Update time selection
   */
  updateSelection() {
    this.selectedDate.setHours(this.selectedHours, this.selectedMinutes, 0, 0);
    
    if (typeof this.options.onSelect === 'function') {
      this.options.onSelect(new Date(this.selectedDate));
    }
  }

  /**
   * Go to previous month
   */
  prevMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.render();
  }

  /**
   * Go to next month
   */
  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.render();
  }

  /**
   * Format month and year
   */
  formatMonthYear() {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
  }

  /**
   * Get selected date
   */
  getSelectedDate() {
    return new Date(this.selectedDate);
  }

  /**
   * Get formatted date and time
   */
  getFormattedDateTime() {
    return this.selectedDate.toLocaleString();
  }

  /**
   * Set minimum date
   */
  setMinDate(date) {
    this.options.minDate = date ? new Date(date) : null;
    this.render();
  }

  /**
   * Set maximum date
   */
  setMaxDate(date) {
    this.options.maxDate = date ? new Date(date) : null;
    this.render();
  }

  /**
   * Set minimum time
   */
  setMinTime(timeString) {
    this.options.minTime = timeString;
    this.render();
  }

  /**
   * Set maximum time
   */
  setMaxTime(timeString) {
    this.options.maxTime = timeString;
    this.render();
  }

  /**
   * Destroy calendar component
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// Export the component
export default Calendar;
