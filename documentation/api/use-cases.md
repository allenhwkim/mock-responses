## **Table of Contents**
- [Use Cases Payload & Sample Responses](#use-cases-payload--sample-responses)
  - [GET /use-cases/:id/edit](#get-use-casesidedit)
  - [GET /use-cases/new](#get-use-casesnew)
  - [GET /use-cases](#get-use-cases)
  - [GET /use-cases/:id](#get-use-casesid)
  - [POST /use-cases](#post-use-cases)
  - [PUT /use-cases /:id](#put-use-cases-id)
  - [GET /use-cases /:id/activate](#get-use-cases-idactivate)
  - [DELETE /use-cases /:id](#delete-use-cases-id)

<hr><br>

# Use Cases Payload & Sample Responses

## GET /use-cases/:id/edit

**Payload:** `N/A`

**Sample Response:**
```html
<h3>
   Update Use Case 
</h3>

<div class="use-case form">
  <input type="hidden" id="id" value="1">

  <div class="id column">
    <label for="id">Id</label>
    <input id="id" readonly value="1" />
  </div>

  <div class="name column">
    <label for="name">Name</label>
    <input id="name" value="test" />
  </div>

  <div class="description column">
    <label for="description">Description</label>
    <input id="description" size="40" value="desc" />
  </div>

  <h3>Mock Responses</h3>
  <div class="mock-responses">
    <div class="left">
      <div class="desc"> Search and add mock responses from the left</div>
      <div class="header row">
        <div class="id">id</div>
        <div class="active">active</div>
        <div class="name">name</div>
        <div class="req_method">method</div>
        <div class="req_url">url</div>
        <div class="action"> &nbsp; </div>
      </div>
      <div class="edit-mock-responses">
        <div class="mock-response row">
          <div class="id">2</div>
          <div class="active">1</div>
          <div class="name"></div>
          <div class="req_method"></div>
          <div class="req_url">/api/world</div>
          <div class="buttons">
            <button onclick="fireEvent(event, 'play-mock-response', 2)">
              <i class="fas fa-play"></i>
            </button>
            <button onclick="this.closest('.row').remove()">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
        <div class="mock-response row">
          <div class="id">3</div>
          <div class="active">0</div>
          <div class="name">test</div>
          <div class="req_method">POST</div>
          <div class="req_url">/api/foo</div>
          <div class="buttons">
            <button onclick="fireEvent(event, 'play-mock-response', 3)">
              <i class="fas fa-play"></i>
            </button>
            <button onclick="this.closest('.row').remove()">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="middle">
      <i class="fas fa-caret-left"></i>
    </div>
    <div class="right">
      <div class="search">
        <input size="30" class="public" 
          placeholder="Type to search mock-responses"
          onchange="searchMockResponses(this.value)" />
      </div>
      <div class="header row">
        <div class="id">id</div>
        <div class="active">active</div>
        <div class="name">name</div>
        <div class="req_method">method</div>
        <div class="req_url">url</div>
        <div></div>
      </div>
      <hce-list id="search-mock-responses" class="list" (selected)="addMockResponse(event)">
        <div class="mock-response row">
          <div class="id">[[id]]</div>
          <div class="active">[[active]]</div>
          <div class="name">[[name]]</div>
          <div class="req_method">[[req_method]]</div>
          <div class="req_url">[[req_url]]</div>
          <div class="buttons">
            <button onclick="fireEvent(event, 'play-mock-response', [[id]])">
              <i class="fas fa-play"></i>
            </button>
          </div>
        </div>
      </hce-list>
    </div>
  </div>

  <br/>
  <div class="buttons">
      <button onclick="fireEvent(event, 'update-use-case', getFormData())">
        <i class="fas fa-edit"></i>
        Update Use Case
      </button>
      <button onclick="fireEvent(event, 'delete-use-case', 1)">
        <i class="fas fa-trash-alt"></i>
        Delete Use Case
      </button>
  </div>
</div>
```

<hr><br>

## GET /use-cases/new

**Payload:** `N/A`

**Sample Response:**
```html
<h3>
   Create Use Case 
</h3>

<div class="use-case form">
  <input type="hidden" id="id" value="">


  <div class="name column">
    <label for="name">Name</label>
    <input id="name" value="" />
  </div>

  <div class="description column">
    <label for="description">Description</label>
    <input id="description" size="40" value="" />
  </div>

  <h3>Mock Responses</h3>
  <div class="mock-responses">
    <div class="left">
      <div class="desc"> Search and add mock responses from the left</div>
      <div class="header row">
        <div class="id">id</div>
        <div class="active">active</div>
        <div class="name">name</div>
        <div class="req_method">method</div>
        <div class="req_url">url</div>
        <div class="action"> &nbsp; </div>
      </div>
      <div class="edit-mock-responses">
      </div>
    </div>
    <div class="middle">
      <i class="fas fa-caret-left"></i>
    </div>
    <div class="right">
      <div class="search">
        <input size="30" class="public" 
          placeholder="Type to search mock-responses"
          onchange="searchMockResponses(this.value)" />
      </div>
      <div class="header row">
        <div class="id">id</div>
        <div class="active">active</div>
        <div class="name">name</div>
        <div class="req_method">method</div>
        <div class="req_url">url</div>
        <div></div>
      </div>
      <hce-list id="search-mock-responses" class="list" (selected)="addMockResponse(event)">
        <div class="mock-response row">
          <div class="id">[[id]]</div>
          <div class="active">[[active]]</div>
          <div class="name">[[name]]</div>
          <div class="req_method">[[req_method]]</div>
          <div class="req_url">[[req_url]]</div>
          <div class="buttons">
            <button onclick="fireEvent(event, 'play-mock-response', [[id]])">
              <i class="fas fa-play"></i>
            </button>
          </div>
        </div>
      </hce-list>
    </div>
  </div>

  <br/>
  <div class="buttons">
      <button onclick="fireEvent(event, 'create-use-case', getFormData())">
        <i class="fas fa-plus-circle"></i>
        Create Use Case
      </button>
  </div>
</div>
```

<hr><br>

## GET /use-cases

**Payload:** `N/A`

**Sample Response:**
```json
[
    {
        "id": 1,
        "name": "test",
        "description": "desc",
        "mock_responses": "1,2,3"
    },
    {
        "id": 2,
        "name": "fdsaf  long desc long desc long desc long desc long",
        "description": "fdsaf  long desc long desc long desc long desc long",
        "mock_responses": "3,8,10"
    },
    {
        "id": 3,
        "name": "111",
        "description": "222",
        "mock_responses": "4,10"
    }
]
```

<hr><br>

## GET /use-cases/:id


**Payload:** `N/A`

**Sample Response:**
```json
{
    "id": 1,
    "name": "test",
    "description": "desc",
    "mock_responses": "1,2,3"
}
```

<hr><br>

## POST /use-cases

*Used when creating a new use case.*

**Payload:**
```json
{ 
    "id":,
    "name": "aaa",
    "description": "samplaaa",
    "mock_responses": "19,19"
}
```

**Sample Response:** `201 response.`

<hr><br>

## PUT /use-cases /:id

**Payload:**
```json
{ 
    "id": 1,
    "name": "test",
    "description": "descri",
    "mock_responses": "2,3" 
}
```

**Sample Response:** `200 - OK.`

<hr><br>

## GET /use-cases /:id/activate

**Payload:** `N/A`

**Sample Response:** `200 - OK.`

<hr><br>

## DELETE /use-cases /:id

**Payload:** `N/A`

**Sample Response:** `200 - OK, no payload in response. User redirected to home page.`
