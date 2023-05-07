const mock = {
  tasks: [
    {
      id: 0,
      type: "Meeting",
      title: "Meeting with Andrew Piker",
      time: "9:00"
    },
    {
      id: 1,
      type: "Call",
      title: "Call with HT Company",
      time: "12:00"
    },
    {
      id: 2,
      type: "Meeting",
      title: "Meeting with Zoe Alison",
      time: "14:00"
    },
    {
      id: 3,
      type: "Interview",
      title: "Interview with HR",
      time: "15:00"
    }
  ],
  bigStat: [
    {
      product: "Light Blue",
      total: {
        monthly: 4232,
        weekly: 1465,
        daily: 199,
        percent: { value: 3.7, profit: false }
      },
      color: "primary",
      registrations: {
        monthly: { value: 830, profit: false },
        weekly: { value: 215, profit: true },
        daily: { value: 33, profit: true }
      },
      bounce: {
        monthly: { value: 4.5, profit: false },
        weekly: { value: 3, profit: true },
        daily: { value: 3.25, profit: true }
      }
    },
    {
      product: "Sing App",
      total: {
        monthly: 754,
        weekly: 180,
        daily: 27,
        percent: { value: 2.5, profit: true }
      },
      color: "warning",
      registrations: {
        monthly: { value: 32, profit: true },
        weekly: { value: 8, profit: true },
        daily: { value: 2, profit: false }
      },
      bounce: {
        monthly: { value: 2.5, profit: true },
        weekly: { value: 4, profit: false },
        daily: { value: 4.5, profit: false }
      }
    },
    {
      product: "RNS",
      total: {
        monthly: 1025,
        weekly: 301,
        daily: 44,
        percent: { value: 3.1, profit: true }
      },
      color: "secondary",
      registrations: {
        monthly: { value: 230, profit: true },
        weekly: { value: 58, profit: false },
        daily: { value: 15, profit: false }
      },
      bounce: {
        monthly: { value: 21.5, profit: false },
        weekly: { value: 19.35, profit: false },
        daily: { value: 10.1, profit: true }
      }
    }
  ],
  notifications: [
    {
      id: 0,
      icon: "thumbs-up",
      color: "primary",
      content:
        'Ken <span className="fw-semi-bold">accepts</span> your invitation'
    },
    {
      id: 1,
      icon: "file",
      color: "success",
      content: "Report from LT Company"
    },
    {
      id: 2,
      icon: "envelope",
      color: "danger",
      content: '4 <span className="fw-semi-bold">Private</span> Mails'
    },
    {
      id: 3,
      icon: "comment",
      color: "success",
      content: '3 <span className="fw-semi-bold">Comments</span> to your Post'
    },
    {
      id: 4,
      icon: "cog",
      color: "light",
      content: 'New <span className="fw-semi-bold">Version</span> of RNS app'
    },
    {
      id: 5,
      icon: "bell",
      color: "info",
      content:
        '15 <span className="fw-semi-bold">Notifications</span> from Social Apps'
    }
  ],
  table: [
    {
      id: 0,
      sensorName: "Mark Otto",

      device_id: "2",
      value: "182",
      date: "11 May 2017",
      clock: "20:20:20",
      status: "Normal"
    },
    {
      id: 1,
      sensorName: "Jacob Thornton",

      device_id: "2",
      value: "182",
      date: "4 Jun 2017",
      clock: "20:20:20",
      status: "Low"
    },
    {
      id: 2,
      sensorName: "Larry the Bird",
      device_id: "2",
      value: "182",
      date: "27 Aug 2017",
      clock: "20:20:20 North",
      status: "High"
    },
    {
      id: 3,
      sensorName: "Joseph May",

      device_id: "2",
      value: "182",
      date: "19 Feb 2018",
      clock: "20:20:20",
      status: "Normal"
    },
    {
      id: 4,
      sensorName: "Peter Horadnia",

      device_id: "2",
      value: "182",
      date: "1 Mar 2018",
      clock: "20:20:20",
      status: "High"
    },
    {
      id: 0,
      sensorName: "Mark Otto",

      device_id: "2",
      value: "182",
      date: "11 May 2017",
      clock: "20:20:20",
      status: "Normal"
    },
    {
      id: 1,
      sensorName: "Jacob Thornton",

      device_id: "2",
      value: "182",
      date: "4 Jun 2017",
      clock: "20:20:20",
      status: "Low"
    },
    {
      id: 2,
      sensorName: "Larry the Bird",
      device_id: "2",
      value: "182",
      date: "27 Aug 2017",
      clock: "20:20:20 North",
      status: "High"
    }
  ]
};

export default mock;