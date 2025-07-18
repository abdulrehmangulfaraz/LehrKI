
function showDemo(toolName) {
    const demos = {
        integrated: "Our integrated writing assistant provides real-time feedback as students type, with color-coded suggestions and educational explanations. Perfect for classroom use with privacy controls and progress tracking.",

        scite: "Scite AI analyzes millions of research papers to provide context about citations. It shows whether studies support, contradict, or mention claims, helping students write evidence-based papers with confidence.",

        elicit: "Elicit can search through 200+ million papers to answer research questions. It summarizes findings, extracts data, and helps brainstorm research directions - like having a research assistant that never sleeps.",

        jenny: "Jenny AI understands academic writing conventions and helps structure essays with proper introductions, thesis statements, and conclusions. It maintains academic integrity while providing writing support."
    };

    alert(`${toolName.charAt(0).toUpperCase() + toolName.slice(1)} Demo:\n\n${demos[toolName]}`);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    console.log('Writing Assistant Hub loaded successfully!');
});
