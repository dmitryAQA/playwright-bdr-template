import { test } from '@playwright/test';

/**
 * Attaches a stylized HTML table to the current test report.
 * @param name The name of the attachment (e.g., "Input Data").
 * @param data Array of objects to display.
 */
export async function attachTable(name: string, data: any[]) {
    if (!data || data.length === 0) return;

    const html = generateHtmlTable(data);
    await test.info().attach(name, {
        body: Buffer.from(html),
        contentType: 'text/html'
    });
}

function generateHtmlTable(data: any[]): string {
    const headers = Object.keys(data[0]);

    const ths = headers.map(h => `<th>${h}</th>`).join('');

    const trs = data.map(row => {
        const tds = headers.map(h => {
            const val = row[h];
            return `<td>${val === undefined || val === null ? '' : val}</td>`;
        }).join('');
        return `<tr>${tds}</tr>`;
    }).join('');

    return `
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
            h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
            table { 
                border-collapse: collapse; 
                width: 100%; 
                margin-top: 20px;
                box-shadow: 0 2px 15px rgba(0,0,0,0.1);
                border-radius: 8px;
                overflow: hidden;
            }
            th { 
                background-color: #2c3e50; 
                color: #ffffff; 
                text-align: left; 
                padding: 12px 15px;
                text-transform: uppercase;
                font-size: 14px;
                letter-spacing: 0.05em;
            }
            td { 
                padding: 12px 15px;
                border-bottom: 1px solid #ddd;
                font-size: 14px;
            }
            tr:nth-child(even) { background-color: #f8f9fa; }
            tr:last-child td { border-bottom: none; }
            tr:hover { background-color: #f1f4f6; transition: background-color 0.2s ease; }
        </style>
    </head>
    <body>
        <h2>Data Table</h2>
        <table>
            <thead><tr>${ths}</tr></thead>
            <tbody>${trs}</tbody>
        </table>
    </body>
    </html>
    `;
}

/**
 * Compares two objects and attaches a side-by-side comparison table to the report.
 * @param name Name of the attachment
 * @param expected Object containing expected values
 * @param actual Object containing actual values
 */
export async function attachCompareTable(name: string, expected: any, actual: any) {
    const allKeys = Array.from(new Set([...Object.keys(expected), ...Object.keys(actual)]));

    const comparisonData = allKeys.map(key => {
        const exp = expected[key];
        const act = actual[key];
        const isMatch = JSON.stringify(exp) === JSON.stringify(act);

        return {
            Field: key,
            Expected: exp === undefined ? '<undefined>' : JSON.stringify(exp),
            Actual: act === undefined ? '<undefined>' : JSON.stringify(act),
            Result: isMatch ? '✅ MATCH' : '❌ MISMATCH'
        };
    });

    await attachTable(name, comparisonData);
}
