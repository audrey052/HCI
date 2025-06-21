// Data terpusat untuk semua tugas, ujian, dan jadwal
const allData = [
    // Data dari halaman Assessment
    {
        id: 'hci_ta05',
        page: 'assessment',
        date: '2025-06-19', // Sesuai tanggal hari ini
        status: 'assigned',
        course: 'Human and Computer Interaction - LA09',
        title: 'TA05 Submission'
    },
    {
        id: 'algorithm_iccp',
        page: 'assessment',
        date: '2025-05-28',
        status: 'assigned',
        course: 'Algorithm and Analysis Design - LA09',
        title: 'ICCP Simulation'
    },
     {
        id: 'algorithm_quiz1',
        page: 'assessment',
        date: '2025-06-14', // 5 hari sebelum 19 Juni
        status: 'missing',
        course: 'Algorithm and Analysis Design - LA01',
        title: 'Quiz 1'
    },
    {
        id: 'project_proposal',
        page: 'assessment',
        date: '2025-05-11', // 39 hari sebelum 19 Juni
        status: 'assigned',
        course: 'Human and Computer Interaction - LC01',
        title: 'Project Proposal Final'
    },
    // Data dari halaman Schedule
    {
        id: "dl-exam",
        page: 'schedule',
        date: "2025-06-21",
        status: "not-done",
        title: "Deep Learning Exam",
        course: "Deep Learning"
    },
    {
        id: "algo-exam",
        page: 'schedule',
        date: "2025-06-21",
        status: "done",
        title: "Algorithm Onsite Exam",
        course: "Algorithm Design and Analysis"
    }
];