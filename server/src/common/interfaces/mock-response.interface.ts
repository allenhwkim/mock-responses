export interface MockResponse {
  id: number;
  name: string;
  req_url: string;
  req_method: string;
  req_payload: string;
  res_status: number;
  res_delay_sec: number;
  res_content_type: string;
  res_body: string;
  created_at: number;
  created_by: string;
  updated_at: number;
  updated_by: string;
}
