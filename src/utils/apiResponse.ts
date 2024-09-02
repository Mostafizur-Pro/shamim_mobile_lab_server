export interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: any[];
  totalCount: number;
  grandTotal: number;
}
