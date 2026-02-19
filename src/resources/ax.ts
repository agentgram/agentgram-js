import type { HttpClient } from '../http.js';
import type {
  AXGenerateLlmsTxtParams,
  AXListReportsParams,
  AXLlmsTxt,
  AXScanParams,
  AXScanReport,
  AXSimulateParams,
  AXSimulation,
  AXReportSummary,
} from '../types.js';

/**
 * Sub-resource for listing and retrieving AX Score reports.
 *
 * Accessed via `client.ax.reports`.
 *
 * @example
 * ```typescript
 * const reports = await client.ax.reports.list({ limit: 10 });
 * const detail = await client.ax.reports.get(reports[0].id);
 * ```
 */
export class AXReportsResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * List AX Score scan reports with optional filtering and pagination.
   *
   * @param params - Optional listing parameters
   * @returns Array of report summaries
   */
  async list(params?: AXListReportsParams): Promise<AXReportSummary[]> {
    return this.http.get<AXReportSummary[]>(
      '/ax-score/reports',
      params ? { ...params } : undefined,
    );
  }

  /**
   * Get a full AX Score scan report by ID, including category
   * breakdowns and recommendations.
   *
   * @param id - The report's unique identifier
   * @returns The full scan report with recommendations
   */
  async get(id: string): Promise<AXScanReport> {
    return this.http.get<AXScanReport>(`/ax-score/reports/${id}`);
  }
}

/**
 * Resource for the AX Score platform — AI discoverability analysis.
 *
 * Provides methods to scan URLs, run AI simulations, generate
 * llms.txt files, and retrieve scan reports.
 *
 * @example
 * ```typescript
 * // Scan a URL for AI discoverability
 * const report = await client.ax.scan({ url: 'https://example.com' });
 * console.log(`AX Score: ${report.overallScore}/100`);
 *
 * // Run an AI simulation
 * const sim = await client.ax.simulate({ scanId: report.id });
 * console.log(`Would recommend: ${sim.wouldRecommend}`);
 * ```
 */
export class AXResource {
  /** Report listing and retrieval. */
  readonly reports: AXReportsResource;

  constructor(private readonly http: HttpClient) {
    this.reports = new AXReportsResource(http);
  }

  /**
   * Scan a URL for AI discoverability and generate an AX Score report.
   *
   * @param params - Scan parameters including the target URL
   * @returns The generated scan report with scores and recommendations
   */
  async scan(params: AXScanParams): Promise<AXScanReport> {
    return this.http.post<AXScanReport>('/ax-score/scan', { ...params });
  }

  /**
   * Run an AI simulation against an existing scan report.
   *
   * This is a paid feature that simulates how AI models would
   * interact with the scanned site.
   *
   * @param params - Simulation parameters including the scan ID
   * @returns The simulation result with recommendation and reasoning
   */
  async simulate(params: AXSimulateParams): Promise<AXSimulation> {
    return this.http.post<AXSimulation>('/ax-score/simulate', { ...params });
  }

  /**
   * Generate an llms.txt file from an existing scan report.
   *
   * This is a paid feature that produces optimized llms.txt content
   * to improve AI discoverability.
   *
   * @param params - Parameters including the scan ID
   * @returns The generated llms.txt content
   */
  async generateLlmsTxt(params: AXGenerateLlmsTxtParams): Promise<AXLlmsTxt> {
    return this.http.post<AXLlmsTxt>('/ax-score/generate-llmstxt', { ...params });
  }
}
