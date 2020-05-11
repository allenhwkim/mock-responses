export interface MockResponse {
  id?: string;
  name?: string;
  req_method?: string;
  req_url?: string;
  req_payload?: string;
  res_status?: number;
  res_content_type?: string;
  res_delay_sec?: number;
  res_body?: string;
};
