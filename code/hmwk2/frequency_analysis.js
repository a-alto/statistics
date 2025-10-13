// Frequency Analysis for Caesar Cipher Breaking
// This script analyzes letter frequency in the quantum.txt file

function getQuantumText() {
    return `arXiv:2106.06841v3 [quant-ph] 7 Apr 2022

Quantum Algorithms and Simulation for Parallel
and Distributed Quantum Computing
Rhea Parekh

Andrea Ricciardi

Ahmed Darwish, Stephen DiAdamo

Independent Scholar
rheaparekh12@gmail.com

Independent Scholar
andrea.ricciardi@live.com

Technische Universität München
{a.darwish, stephen.diadamo}@tum.de

Abstract—A viable approach for building large-scale quantum
computers is to interlink small-scale quantum computers with
a quantum network to create a larger distributed quantum
computer. When designing quantum algorithms for such a
distributed quantum computer, one can make use of the added
parallelization and distribution abilities inherent in the system.
An added difficulty to then overcome for distributed quantum
computing is that a complex control system to orchestrate the
various components is required. In this work, we aim to address
these issues. We explicitly define what it means for a quantum
algorithm to be distributed and then present various quantum
algorithms that fit the definition. We discuss potential benefits and
propose a high-level scheme for controlling the system. With this,
we present our software framework called Interlin-q, a simulation
platform that aims to simplify designing and verifying parallel
and distributed quantum algorithms. We demonstrate Interlin-q
by implementing some of the discussed algorithms using Interlinq and layout future steps for developing Interlin-q into a control
system for distributed quantum computers.
Index Terms—Distributed quantum computing, distributed
quantum algorithms, quantum software, networked control systems

I. INTRODUCTION
CALING quantum computers up to levels where practical
quantum algorithms can be executed will require a number
of technological breakthroughs. In the present state of technology, scaling quantum computers past the 100 qubit mark has
proven challenging [1]. Even when quantum computers can
support a large number of qubits in a single system, if current
methods error correction methods like surface codes are used,
the amount of control signals required to perform error correction will scale with the number of qubits, potentially bottlenecking logical instructions for an algorithm's execution [2].
To overcome these obstacles, a potential solution is to instead
create smaller-scale quantum computers and interlink them
using a quantum network to perform quantum algorithms over
a distributed system. The benefit of using smaller, interlinked
quantum processors is the ability to perform larger quantum
circuits on more robust and controllable quantum processors
albeit with the added—potentially easier—problem of using
distribution methods. When one can use networked quantum
computers, an additional ability to use parallelism in algorithm
design is enabled.
When moving from monolithic to distributed quantum
computers, a variety of challenges arise. Indeed, there are
many technological challenges to overcome towards building
distributed quantum computers. A naturally arising problem to

consider in this perspective is performing two-qubit operations
between qubits that are physically separated between two
quantum computers. To perform two-qubit operations with
monolithic quantum technologies, generally the two qubits are
physically near each other, and if not, swap-gates are applied
to bring them near enough, known as the qubit routing problem
[3]. On the other hand, for two-qubit operations between
distributed qubits, one needs a new technique for transporting
the control information between devices. Possible options are
to physically transmit qubits via a potentially noisy and lossy
medium [4], using quantum teleportation [5], [6], transferring
control information to a flying qubit [7], [8], or using the
method introduced in [9] using one entangled pair and a two
bits of classical communication as seen in Fig. 1.
Once a method of performing non-local two qubit gates
is selected, quantum circuits designed for monolithic systems
need to then be remapped to a logically equivalent distributed
version. To perform the remapping, one starts with the topology of the networked quantum computers, each with their
own quantum processor chip structures. A monolithic circuit is
converted such that any multi-qubit operation involving qubits
located on different processors is replaced with a logically
equivalent set of instructions orchestrating the additional tasks
needed for the non-local operation. This remapping problem
has been addressed in a variety of ways [10]–[15], but until
distributed quantum computing becomes more standardized,
the most applicable method for generating and optimizing
distributed circuits remains an open problem.
The next problem arising is how to design and develop a
control system for a distributed system of quantum computers.
Already a step in this direction is the concept of cloud quantum
computing which takes user input—usually as a circuit—and
a software layer converts the input into control instructions for
a single quantum computer [16], [17]. The quantum computer
performs the computation and the results are sent back to
the user via a communication network. For a distributed
system of quantum computers, additional network connections
are needed between the quantum computers. Moreover, the
connections cannot simply be classical channels, but quantum
channels will be needed for either distributing entanglement
or moving data-containing qubits. Networked control systems
for classical distributed systems have been developed in various scenarios [18], for example in GPU clusters [19], but
a key problem that is not as critical for classical systems
for computing is that the quantum computers need to be

algorithms to distributed quantum programs and scheduling
them for execution. Executing a distributed quantum algorithm
on a distributed quantum computer has a general preparation
and execution stages: 1) Allocate logical qubits within the
network of quantum computers; 2) Remap circuits for the
possibly distributed qubit assignment; 3) Generate a schedule
for the control operations; 4) Distribute and execute the
schedule; and 5) Merge the outputs. Some quantum algorithms,
of
which we investigate in the next section, have a particFig. 1. Circuit diagram for a non-local CNOT gate between |ψ1 i and |ψ2 i
where (a) is the cat-entangler sequence and (b) the cat-disentangler sequence. ular structure that allows them to gain a large "horizontal"
The upper two qubits and the lower two qubits are physically separated
between quantum computers.
speedups when parallelized, where other quantum algorithms
requiring many logical qubits can more readily be executed
highly time-synchronized to perform joint measurements, for on nearer-term quantum computers via a distributed quantum
one. It is therefore a unique problem to design networked computer. To model this staged process of preparation and
control systems for distributed quantum computers. Proposals execution, we start with a QPU structure as collection of
integers Q = [q1 , ..., qk ] representing a network of k QPUs
addressing such control systems are found in [10], [20].
Finally, once the ability to perform distributed quantum where each QPU i has qi ∈ N logical qubits. In this model,
algorithms is enabled, one can then start to consider the various it is implied that the quantum network topology is completely
quantum algorithms that can benefit from being distributed connected entanglement units are created during runtime. With
and parallelized. Such examples have been considered such this, we define a quantum parallel program.
Definition 1 (Parallel Program): A program P is the
as of distributed Shor's algorithm [9], Quantum Phase Estimation (QPE) [21], and accelerated Variational Quantum instruction-set needed to perform a monolithic execution of
Eigensolver (VQE) [10]. Further, a mathematical framework a quantum circuit including the logical circuit and the number
for expressing and analyzing distributed quantum algorithms of times to repeat the execution of the circuit. A schedule
has been developed in [22]. Now that the hardware technology S(i) is a mapping from an execution-round number i to sets
is beginning to catch up with the theory, a relatively open field of integers, where |S(i)| is always the number of QPUs in
remains is to better understand what advantages—especially the network. The k-th set of S(i) represents the programs
while considering the cost of execution—there really are to Pi ⊂ {Pj }nj=1 , where there are n programs total to run,
executing at time i on QPU k where two distinct sets in S(i)
gain when moving into a distributed setting.
In this work, we investigate two angles for distributed are not necessarily disjoint. A collection of programs {Pj }nj=1 ,
quantum computing. We consider firstly a formalization of a function M : On 7→ O for O the output of a program which
parallel and distributed quantum programs and consider a acts as a central merging function, and a schedule form a
collection of quantum algorithms fitting this formalization. parallel program P = {{P1 , ..., Pn }, S(i), M }.
Definition 2 (Distributed Program): Given QPUs Q =
Next, we introduce a novel software simulation tool for
simulating distributed quantum algorithms called Interlin-q. [q1 , ..., qk ], a distributed program dP is a program P where
Interlin-q is a Python library built on top of QuNetSim the circuit execution instructions of P are assigned to qubits
[23]—a quantum network simulator—which generates and from multiple distinct QPUs from Q. In this framework, it
simulates the control steps needed in an asynchronous setting implies there exists an i where there are at least two distinct
to simulate distributed quantum algorithms. The overall goal sets both containing P .
of the platform is to provide a tool for validating algorithms To generate P, the collection of programs and schedule,
for distributing quantum circuits and testing control systems. Algorithm 1 is used. Input to Algorithm 1 is 1) The specifiIn addition, one can use Interlin-q to simulate parallel and cations of the distributed quantum computers Q = [q1 , ..., qn ];
distributed algorithms to then benchmark the approaches for 2) The circuit input to the program with width w, that is, the
their distribution and parallelization efficiency. In this work, number of qubits simultaneously needed to run the circuit;
we provide an overview of the software library in its current 3) An algorithm A which takes Q as input and determines
state and some demonstrations. Overall, interlinking quantum an allocation for w logical qubits or determines no allocation
computers to perform distributed quantum algorithms will exists; 4) A collection of monolithic programs {Pi }ni=1 . The
inevitably be an important part of quantum computing in output of the algorithm is a schedule for executing a distributed
the coming future. This work aims to shed light on the program {{dPi }ni=1 , S(i), M }. In Fig. 2 is a depiction of how
open problems and foreseeable benefits of distributed quantum such a system could perform.
Example 1: Let {P1 , ..., P10 } be a collection of programs
computing, an increasingly important topic for the future of
that run circuits with width w = 4 and Q = [10, 10].
quantum computing.
If A is an algorithm that greedily allocates qubits, then
II. MONOLITHIC TO DISTRIBUTED ALGORITHMS
the output of Algorithm 1 is: S(0) = {{1, 2, 3}, {3, 4, 5}},
To start our investigation of distributed quantum algorithms, S(1) = {{6, 7, 8}, {8, 9, 10}} and {dP1 , ..., dP10 }, where dP3
we generalize the concept of mapping monolithic quantum and dP8 are distributed between the two QPUs and the other`;
}

async function analyzeFrequency() {
    try {
        // Show loading indicator
        const button = document.querySelector('.btn');
        const originalText = button.textContent;
        button.textContent = 'Analyzing...';
        button.disabled = true;

        // Use embedded text content to avoid CORS issues
        const text = getQuantumText();

        // Initialize frequency counter for all 26 letters
        const frequency = {};
        for (let i = 0; i < 26; i++) {
            frequency[String.fromCharCode(65 + i)] = 0; // A-Z
        }

        // Count letter frequencies (case-insensitive)
        let totalLetters = 0;
        for (let char of text) {
            const upperChar = char.toUpperCase();
            if (upperChar >= 'A' && upperChar <= 'Z') {
                frequency[upperChar]++;
                totalLetters++;
            }
        }

        // Calculate percentages
        const percentages = {};
        for (let letter in frequency) {
            percentages[letter] = totalLetters > 0 ? (frequency[letter] / totalLetters * 100) : 0;
        }

        // Sort letters alphabetically for display
        const alphabeticalLetters = Object.keys(percentages).sort();

        // Create results display
        createResultsDisplay(alphabeticalLetters, percentages, frequency, totalLetters);

        // Create histogram
        createHistogram(alphabeticalLetters, percentages);

        // Reset button
        button.textContent = originalText;
        button.disabled = false;

    } catch (error) {
        console.error('Error analyzing frequency:', error);
        alert('Error analyzing the text. Please try again.');
        
        // Reset button
        const button = document.querySelector('.btn');
        button.textContent = 'Analyze Frequency';
        button.disabled = false;
    }
}

function createResultsDisplay(alphabeticalLetters, percentages, frequency, totalLetters) {
    // Remove existing results if any
    const existingResults = document.getElementById('frequency-results');
    if (existingResults) {
        existingResults.remove();
    }

    // Create results container
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'frequency-results';
    resultsDiv.innerHTML = `
        <h3>Letter Frequency Analysis Results</h3>
        <p><strong>Total letters analyzed:</strong> ${totalLetters}</p>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th>Letter</th>
                    <th>Count</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                ${alphabeticalLetters.map(letter => `
                    <tr>
                        <td>${letter}</td>
                        <td>${frequency[letter]}</td>
                        <td>${percentages[letter].toFixed(2)}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Insert after the button
    const button = document.querySelector('.btn');
    button.parentNode.insertBefore(resultsDiv, button.nextSibling);
}

function createHistogram(alphabeticalLetters, percentages) {
    // Remove existing histogram if any
    const existingHistogram = document.getElementById('frequency-histogram');
    if (existingHistogram) {
        existingHistogram.remove();
    }

    // Create histogram container
    const histogramDiv = document.createElement('div');
    histogramDiv.id = 'frequency-histogram';
    histogramDiv.innerHTML = `
        <h3>Letter Frequency Histogram</h3>
        <div style="max-width: 800px; margin: 2rem auto;">
            <canvas id="frequencyChart" width="800" height="400"></canvas>
        </div>
    `;

    // Insert after results
    const resultsDiv = document.getElementById('frequency-results');
    resultsDiv.parentNode.insertBefore(histogramDiv, resultsDiv.nextSibling);

    // Create Chart.js histogram
    setTimeout(() => {
        const ctx = document.getElementById('frequencyChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: alphabeticalLetters,
                datasets: [{
                    label: 'Letter Frequency (%)',
                    data: alphabeticalLetters.map(letter => percentages[letter]),
                    backgroundColor: 'rgba(36, 163, 225, 0.7)',
                    borderColor: 'rgba(36, 163, 225, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: 10 },
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Letter Frequency Distribution',
                        color: '#e8e8e8',
                        font: { size: 16, weight: 'bold' }
                    }
                },
                scales: {
                    x: {
                        title: { 
                            display: true, 
                            text: 'Letters', 
                            color: '#b8b8b8',
                            font: { size: 14 }
                        },
                        ticks: { 
                            color: '#b8b8b8',
                            font: { size: 12 }
                        },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                        title: { 
                            display: true, 
                            text: 'Frequency (%)', 
                            color: '#b8b8b8',
                            font: { size: 14 }
                        },
                        beginAtZero: true,
                        ticks: { 
                            color: '#b8b8b8',
                            font: { size: 12 },
                            callback: function(value) {
                                return value.toFixed(1) + '%';
                            }
                        },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                }
            }
        });
    }, 100);
}

// Function to show standard English letter frequency
function showEnglishFrequency() {
    try {
        // Show loading indicator - find the button by its onclick content
        const buttons = document.querySelectorAll('.btn');
        let button = null;
        let originalText = '';
        
        for (let btn of buttons) {
            if (btn.getAttribute('onclick') === 'showEnglishFrequency()') {
                button = btn;
                originalText = btn.textContent;
                btn.textContent = 'Loading...';
                btn.disabled = true;
                break;
            }
        }

        // Standard English letter frequencies based on large text corpora
        // Source: Analysis of English text from various sources
        const englishFrequency = {
            'A': 8.17, 'B': 1.49, 'C': 2.78, 'D': 4.25, 'E': 12.70,
            'F': 2.23, 'G': 2.02, 'H': 6.09, 'I': 6.97, 'J': 0.15,
            'K': 0.77, 'L': 4.03, 'M': 2.41, 'N': 6.75, 'O': 7.51,
            'P': 1.93, 'Q': 0.10, 'R': 5.99, 'S': 6.33, 'T': 9.06,
            'U': 2.76, 'V': 0.98, 'W': 2.36, 'X': 0.15, 'Y': 1.97,
            'Z': 0.07
        };

        // Calculate total count (simulated from percentages)
        const totalLetters = 100000; // Reference corpus size
        const frequency = {};
        for (let letter in englishFrequency) {
            frequency[letter] = Math.round((englishFrequency[letter] / 100) * totalLetters);
        }

        // Sort letters alphabetically
        const alphabeticalLetters = Object.keys(englishFrequency).sort();

        // Create results display
        createEnglishResultsDisplay(alphabeticalLetters, englishFrequency, frequency, totalLetters);

        // Create histogram
        createEnglishHistogram(alphabeticalLetters, englishFrequency);

        // Reset button
        if (button) {
            button.textContent = originalText;
            button.disabled = false;
        }

    } catch (error) {
        console.error('Error displaying English frequency:', error);
        alert('Error displaying English frequency. Please try again.');
        
        // Reset button
        const buttons = document.querySelectorAll('.btn');
        for (let btn of buttons) {
            if (btn.getAttribute('onclick') === 'showEnglishFrequency()') {
                btn.textContent = 'Show frequency of English letters';
                btn.disabled = false;
                break;
            }
        }
    }
}

function createEnglishResultsDisplay(alphabeticalLetters, percentages, frequency, totalLetters) {
    // Remove existing results if any
    const existingResults = document.getElementById('english-frequency-results');
    if (existingResults) {
        existingResults.remove();
    }

    // Create results container
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'english-frequency-results';
    resultsDiv.innerHTML = `
        <h3>Standard English Letter Frequency</h3>
        <p><strong>Reference corpus size:</strong> ${totalLetters.toLocaleString()} letters</p>
        <p style="color: #b8b8b8; font-size: 0.95rem; margin-bottom: 1rem;">
            Based on analysis of typical English texts
        </p>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th>Letter</th>
                    <th>Count</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                ${alphabeticalLetters.map(letter => `
                    <tr>
                        <td>${letter}</td>
                        <td>${frequency[letter].toLocaleString()}</td>
                        <td>${percentages[letter].toFixed(2)}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Insert after the button
    const buttons = document.querySelectorAll('.btn');
    for (let btn of buttons) {
        if (btn.getAttribute('onclick') === 'showEnglishFrequency()') {
            btn.parentNode.insertBefore(resultsDiv, btn.nextSibling);
            break;
        }
    }
}

function createEnglishHistogram(alphabeticalLetters, percentages) {
    // Remove existing histogram if any
    const existingHistogram = document.getElementById('english-frequency-histogram');
    if (existingHistogram) {
        existingHistogram.remove();
    }

    // Create histogram container
    const histogramDiv = document.createElement('div');
    histogramDiv.id = 'english-frequency-histogram';
    histogramDiv.innerHTML = `
        <h3>English Letter Frequency Histogram</h3>
        <div style="max-width: 800px; margin: 2rem auto;">
            <canvas id="englishFrequencyChart" width="800" height="400"></canvas>
        </div>
    `;

    // Insert after results
    const resultsDiv = document.getElementById('english-frequency-results');
    if (resultsDiv) {
        resultsDiv.parentNode.insertBefore(histogramDiv, resultsDiv.nextSibling);
    }

    // Create Chart.js histogram
    setTimeout(() => {
        const ctx = document.getElementById('englishFrequencyChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: alphabeticalLetters,
                datasets: [{
                    label: 'Letter Frequency (%)',
                    data: alphabeticalLetters.map(letter => percentages[letter]),
                    backgroundColor: 'rgba(34, 197, 94, 0.7)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: 10 },
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Standard English Letter Frequency Distribution',
                        color: '#e8e8e8',
                        font: { size: 16, weight: 'bold' }
                    }
                },
                scales: {
                    x: {
                        title: { 
                            display: true, 
                            text: 'Letters', 
                            color: '#b8b8b8',
                            font: { size: 14 }
                        },
                        ticks: { 
                            color: '#b8b8b8',
                            font: { size: 12 }
                        },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                        title: { 
                            display: true, 
                            text: 'Frequency (%)', 
                            color: '#b8b8b8',
                            font: { size: 14 }
                        },
                        beginAtZero: true,
                        ticks: { 
                            color: '#b8b8b8',
                            font: { size: 12 },
                            callback: function(value) {
                                return value.toFixed(1) + '%';
                            }
                        },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                }
            }
        });
    }, 100);
}
