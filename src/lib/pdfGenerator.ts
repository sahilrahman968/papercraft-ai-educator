
import { QuestionPaper } from '@/types';

// In a real implementation, this would use a library like jsPDF or html2pdf
// For now, this is a placeholder that would trigger a download in a real app

export async function generatePDF(questionPaper: QuestionPaper, password?: string): Promise<void> {
  console.log('Generating PDF for paper:', questionPaper.title);
  console.log('With password (if provided):', password);
  
  // In a real implementation, you would:
  // 1. Generate HTML content from the question paper
  // 2. Use jsPDF or html2pdf to convert it to PDF
  // 3. Apply password protection if specified
  // 4. Trigger download
  
  // For now, we'll simulate a download by opening a new tab with the content
  const htmlContent = generateHtmlContent(questionPaper);
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Open in a new tab (in a real app, this would download a PDF)
  window.open(url, '_blank');
  
  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
  
  return Promise.resolve();
}

function generateHtmlContent(paper: QuestionPaper): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${paper.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .school-name {
          font-size: 24px;
          font-weight: bold;
        }
        .exam-title {
          font-size: 20px;
          margin: 10px 0;
        }
        .metadata {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
        }
        .instructions {
          background-color: #f9f9f9;
          padding: 15px;
          border: 1px solid #ddd;
          margin-bottom: 30px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          background-color: #f0f0f0;
          padding: 8px;
        }
        .section-description {
          font-style: italic;
          margin-bottom: 15px;
        }
        .question {
          margin-bottom: 20px;
        }
        .question-marks {
          float: right;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="school-name">${paper.schoolHeader || 'School Name'}</div>
        <div class="exam-title">${paper.title}</div>
        <div class="metadata">
          <div>Class: ${paper.class}</div>
          <div>Subject: ${paper.subject}</div>
          <div>Total Marks: ${paper.totalMarks}</div>
          <div>Duration: ${paper.duration} minutes</div>
        </div>
      </div>
      
      <div class="instructions">
        <strong>Instructions:</strong>
        <ol>
          ${paper.instructions?.map(instruction => `<li>${instruction}</li>`).join('') || '<li>Answer all questions.</li>'}
        </ol>
      </div>
      
      ${paper.sections.map((section, sIndex) => `
        <div class="section">
          <div class="section-title">${section.title}</div>
          <div class="section-description">${section.description || ''}</div>
          
          ${section.questions.map((question, qIndex) => `
            <div class="question">
              <span class="question-marks">[${question.marks} Marks]</span>
              <div>Q${sIndex + 1}.${qIndex + 1} ${question.text}</div>
              
              ${question.type === 'MCQ' && question.options ? `
                <div class="options">
                  ${question.options.map((option, oIndex) => `
                    <div>${String.fromCharCode(65 + oIndex)}. ${option}</div>
                  `).join('')}
                </div>
              ` : ''}
              
              ${question.hasImage && question.imageUrl ? `
                <div class="image">
                  <img src="${question.imageUrl}" alt="Question image" style="max-width: 400px; margin: 10px 0;" />
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `).join('')}
      
      <div style="text-align: center; margin-top: 50px;">*** End of Question Paper ***</div>
    </body>
    </html>
  `;
}
