

let currentTemplate = 'standard';
let lessonPlan = {
    title: 'Introduction to Fractions',
    subject: 'mathematics',
    gradeLevel: '4',
    duration: 45,
    classSize: 25,
    topic: 'Understanding fractions as parts of a whole',
    priorKnowledge: 'Students understand basic counting and can identify shapes. Previous exposure to equal parts.',
    objectives: [
        'Students will identify fractions as parts of a whole',
        'Students will represent fractions using visual models',
        'Students will compare simple fractions (1/2, 1/3, 1/4)',
        'Students will solve basic fraction problems in real-world contexts'
    ],
    standards: [
        { code: 'CCSS.MATH.4.NF.A.1', description: 'Explain why a fraction a/b is equivalent to a fraction (n×a)/(n×b)' },
        { code: 'CCSS.MATH.4.NF.A.2', description: 'Compare two fractions with different numerators and denominators' }
    ],
    materials: ['🍕 Pizza fraction models', '📊 Fraction circles', '📱 Interactive whiteboard', '📝 Student worksheets', '✏️ Colored pencils', '📚 Math journals'],
    timeline: [
        { time: '0-5 min', activity: 'Hook & Introduction', description: 'Show a pizza cut into different pieces. Ask: "How would you share this fairly?"' },
        { time: '5-15 min', activity: 'Direct Instruction', description: 'Introduce fraction terminology using visual models. Demonstrate 1/2, 1/3, 1/4.' },
        { time: '15-30 min', activity: 'Guided Practice', description: 'Students work with fraction circles in pairs to create and identify fractions.' },
        { time: '30-40 min', activity: 'Independent Practice', description: 'Complete fraction identification worksheet and math journal reflection.' },
        { time: '40-45 min', activity: 'Closure & Assessment', description: 'Exit ticket: Draw and label three different fractions. Quick class discussion.' }
    ]
};

// Update displays when form values change
document.getElementById('lessonTitle').addEventListener('input', updateDisplays);
document.getElementById('subject').addEventListener('change', updateDisplays);
document.getElementById('gradeLevel').addEventListener('change', updateDisplays);
document.getElementById('duration').addEventListener('input', updateDisplays);
document.getElementById('classSize').addEventListener('input', updateDisplays);

function updateDisplays() {
    const title = document.getElementById('lessonTitle').value || 'Untitled Lesson';
    const subject = document.getElementById('subject').value;
    const grade = document.getElementById('gradeLevel').value;
    const duration = document.getElementById('duration').value;
    const classSize = document.getElementById('classSize').value;

    document.getElementById('displayTitle').textContent = title;
    document.getElementById('displaySubject').textContent = getSubjectName(subject);
    document.getElementById('displayGrade').textContent = getGradeName(grade);
    document.getElementById('displayDuration').textContent = duration;
    document.getElementById('displaySize').textContent = classSize;

    lessonPlan.title = title;
    lessonPlan.subject = subject;
    lessonPlan.gradeLevel = grade;
    lessonPlan.duration = parseInt(duration);
    lessonPlan.classSize = parseInt(classSize);
}

function getSubjectName(subject) {
    const subjects = {
        'mathematics': 'Mathematics',
        'science': 'Science',
        'english': 'English Language Arts',
        'social-studies': 'Social Studies',
        'art': 'Art',
        'music': 'Music',
        'pe': 'Physical Education',
        'other': 'Other'
    };
    return subjects[subject] || subject;
}

function getGradeName(grade) {
    if (grade === 'K') return 'Kindergarten';
    return grade + (grade === '1' ? 'st' : grade === '2' ? 'nd' : grade === '3' ? 'rd' : 'th') + ' Grade';
}

function selectTemplate(template) {
    // Update visual selection
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.classList.add('selected');

    currentTemplate = template;

    // Apply template-specific changes
    switch (template) {
        case 'inquiry':
            updateForInquiryTemplate();
            break;
        case 'flipped':
            updateForFlippedTemplate();
            break;
        case 'project':
            updateForProjectTemplate();
            break;
        default:
            updateForStandardTemplate();
    }
}

function updateForInquiryTemplate() {
    // Update timeline for inquiry-based learning
    const timeline = [
        { time: '0-10 min', activity: 'Problem Presentation', description: 'Present the driving question: "How can we fairly share different amounts?"' },
        { time: '10-25 min', activity: 'Investigation', description: 'Students explore fraction problems in small groups using manipulatives.' },
        { time: '25-35 min', activity: 'Findings Discussion', description: 'Groups share discoveries and strategies with the class.' },
        { time: '35-45 min', activity: 'Conclusion & Reflection', description: 'Synthesize learning and create hypothesis for next investigation.' }
    ];
    updateTimeline(timeline);
}

function updateForFlippedTemplate() {
    const timeline = [
        { time: '0-5 min', activity: 'Homework Review', description: 'Quick check of video notes and questions from home viewing.' },
        { time: '5-35 min', activity: 'Practice & Application', description: 'Work through fraction problems and activities in class with teacher support.' },
        { time: '35-45 min', activity: 'Assessment & Preview', description: 'Mini-quiz and preview of next home video content.' }
    ];
    updateTimeline(timeline);
}

function updateForProjectTemplate() {
    const timeline = [
        { time: '0-10 min', activity: 'Project Introduction', description: 'Introduce fraction restaurant menu project and success criteria.' },
        { time: '10-35 min', activity: 'Planning & Research', description: 'Students plan their menu items and fraction-based pricing.' },
        { time: '35-45 min', activity: 'Progress Check', description: 'Peer feedback and teacher conferences on project progress.' }
    ];
    updateTimeline(timeline);
}

function updateForStandardTemplate() {
    // Reset to standard timeline (already in lessonPlan object)
    updateTimeline(lessonPlan.timeline);
}

function updateTimeline(timeline) {
    const container = document.getElementById('timelineContent');
    container.innerHTML = '';

    timeline.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
                    <div class="timeline-time">${item.time}</div>
                    <div class="timeline-content">
                        <div class="timeline-activity">${item.activity}</div>
                        <div class="timeline-description">${item.description}</div>
                    </div>
                `;
        container.appendChild(timelineItem);
    });
}

// AI Assistant Functions
function generateObjectives() {
    showLoadingState('Generating learning objectives...');

    setTimeout(() => {
        const topic = document.getElementById('topic').value;
        const grade = document.getElementById('gradeLevel').value;

        const newObjectives = [
            `Students will understand the core concept of ${topic}`,
            `Students will apply ${topic} in practical situations`,
            `Students will analyze examples of ${topic}`,
            `Students will create original work demonstrating ${topic}`
        ];

        updateObjectives(newObjectives);
        showSaveIndicator();
    }, 2000);
}

function suggestActivities() {
    showLoadingState('Suggesting engaging activities...');

    setTimeout(() => {
        const activities = [
            { time: '0-10 min', activity: 'Interactive Hook', description: 'Engage students with a real-world problem or demonstration' },
            { time: '10-25 min', activity: 'Collaborative Exploration', description: 'Students work in groups to discover key concepts' },
            { time: '25-40 min', activity: 'Hands-on Practice', description: 'Apply learning through manipulatives and activities' },
            { time: '40-45 min', activity: 'Reflection & Assessment', description: 'Students demonstrate understanding and reflect on learning' }
        ];

        updateTimeline(activities);
        showSaveIndicator();
    }, 2000);
}

function findStandards() {
    showLoadingState('Finding relevant standards...');

    setTimeout(() => {
        const subject = document.getElementById('subject').value;
        const grade = document.getElementById('gradeLevel').value;

        let standards = [];
        if (subject === 'mathematics') {
            standards = [
                { code: `CCSS.MATH.${grade}.NBT.A.1`, description: 'Understand place value concepts' },
                { code: `CCSS.MATH.${grade}.OA.A.2`, description: 'Solve problems using operations' }
            ];
        } else if (subject === 'english') {
            standards = [
                { code: `CCSS.ELA.${grade}.RL.1`, description: 'Read and comprehend literature' },
                { code: `CCSS.ELA.${grade}.W.3`, description: 'Write narratives' }
            ];
        } else {
            standards = [
                { code: `STATE.${subject.toUpperCase()}.${grade}.1`, description: 'Core content standard' },
                { code: `STATE.${subject.toUpperCase()}.${grade}.2`, description: 'Application standard' }
            ];
        }

        updateStandards(standards);
        showSaveIndicator();
    }, 1500);
}

function createAssessment() {
    showLoadingState('Creating assessment strategies...');

    setTimeout(() => {
        const assessments = [
            { type: 'Formative Assessment', description: 'Observation checklist during group work and individual conferences' },
            { type: 'Summative Assessment', description: 'End-of-lesson performance task demonstrating key concepts' },
            { type: 'Peer Assessment', description: 'Students evaluate each other\'s work using provided rubric' },
            { type: 'Self-Assessment', description: 'Reflection journal entry on learning goals and challenges' }
        ];

        updateAssessments(assessments);
        showSaveIndicator();
    }, 1500);
}

function generateFullLesson() {
    showLoadingState('Generating complete lesson plan...');

    // Simulate AI generation with progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 20;
        updateProgress(progress);

        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                hideLoadingState();
                generateObjectives();
                setTimeout(() => {
                    suggestActivities();
                    setTimeout(() => {
                        findStandards();
                        setTimeout(() => {
                            createAssessment();
                            showSaveIndicator();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }
    }, 400);
}

// Utility Functions
function showLoadingState(message) {
    const lessonPlan = document.getElementById('lessonPlanContent');
    lessonPlan.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    ${message}
                </div>
            `;
}

function updateProgress(percent) {
    const lessonPlan = document.getElementById('lessonPlanContent');
    lessonPlan.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    Generating lesson plan...
                    <div class="progress-bar" style="width: 200px; margin-top: 15px;">
                        <div class="progress-fill" style="width: ${percent}%;"></div>
                    </div>
                    <div style="margin-top: 10px;">${percent}%</div>
                </div>
            `;
}

function hideLoadingState() {
    // Restore the original lesson plan content
    location.reload();
}

function updateObjectives(objectives) {
    const list = document.getElementById('objectivesList');
    list.innerHTML = '';
    objectives.forEach(objective => {
        const li = document.createElement('li');
        li.textContent = objective;
        list.appendChild(li);
    });
}

function updateStandards(standards) {
    const grid = document.getElementById('standardsGrid');
    grid.innerHTML = '';
    standards.forEach(standard => {
        const div = document.createElement('div');
        div.className = 'standard-item';
        div.innerHTML = `
                    <div class="standard-code">${standard.code}</div>
                    <div>${standard.description}</div>
                `;
        grid.appendChild(div);
    });
}

function updateAssessments(assessments) {
    const container = document.getElementById('assessmentContent');
    container.innerHTML = '';
    assessments.forEach(assessment => {
        const div = document.createElement('div');
        div.className = 'assessment-item';
        div.innerHTML = `
                    <div class="assessment-type">${assessment.type}</div>
                    <div>${assessment.description}</div>
                `;
        container.appendChild(div);
    });
}

function showSaveIndicator() {
    const indicator = document.getElementById('saveIndicator');
    indicator.classList.add('show');
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 3000);
}

// Action Functions
function saveLessonPlan() {
    showSaveIndicator();
    // Simulate saving
    console.log('Lesson plan saved:', lessonPlan);
}

function loadTemplate() {
    alert('This would open a library of pre-built lesson plan templates to choose from.');
}

function clearPlan() {
    if (confirm('Are you sure you want to clear the current lesson plan?')) {
        location.reload();
    }
}

function editLessonPlan() {
    alert('Edit mode would allow inline editing of all lesson plan sections.');
}

function duplicatePlan() {
    alert('Lesson plan duplicated! You can now modify it for a different class or topic.');
}

function sharePlan() {
    alert('Share options: Email to colleagues, Add to school resource library, Generate shareable link.');
}

function exportPlan(format) {
    const formats = {
        'pdf': 'PDF document',
        'word': 'Microsoft Word document',
        'google': 'Google Docs',
        'print': 'printer-friendly format',
        'email': 'email with attachments'
    };

    alert(`Exporting lesson plan "${lessonPlan.title}" as ${formats[format]}...\n\nIn the full version, this would generate and download/send the actual file.`);
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    updateDisplays();
    console.log('Lesson Plan Generator loaded successfully!');
});
