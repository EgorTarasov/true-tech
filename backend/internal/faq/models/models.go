package models

type MlQuery struct {
	Text string `json:"text"`
}

type MlResponse struct {
	QueryId  int64  `json:"query_id"`
	Text     string `json:"text"`
	Metadata string `json:"metadata"`
	Last     bool   `json:"last"`
	Sender   string `json:"sender"`
}

type QueryCreate struct {
	Text     string `json:"text"`
	Response string `json:"response"`
}
