var testData = `id,first_name,last_name,email,gender,ip_address
1,Ignatius,Hewins,ihewins0@amazon.co.uk,Male,131.30.216.12
2,Grant,Skuse,gskuse1@aol.com,Male,174.143.162.77
3,Cynthia,Roache,croache2@redcross.org,Female,56.170.59.53
4,Shepard,Bysouth,sbysouth3@walmart.com,Male,186.216.181.252
5,Isidor,Rysdale,irysdale4@illinois.edu,Male,206.19.107.105
6,Constantin,Worg,cworg5@issuu.com,Male,140.222.155.17
7,Dre,Knappitt,dknappitt6@netlog.com,Female,185.117.139.155
8,Hynda,Flewin,hflewin7@cbc.ca,Female,178.181.254.102
9,Alanah,Ranklin,aranklin8@businessinsider.com,Female,75.112.23.248
*** Demo some long text goes here to the end of the columns which needs to be very long text spanning across the columns from first column to the last column, which is challenging
10,Karilynn,Fevier,kfevier9@hc360.com,Female,212.134.112.64`;

//--------------------------------------------------------------

let CSVeditor = (function() {
  let csvData = ``;
  let csvArray = ``;
  let id = ``;
  let configClass = "cell-config";
  let configEnabledClass = "cell-config-enabled";
  let configActionsClass = "cell-config-actions";

  let _html_config_button = `<div class="${configClass}">O</div>`;
  let _html_config_actions = `<div class="${configActionsClass}">Some menu items</div>`;

  let init = function(parentSelector, tableId, csv) {
    id = tableId;
    csvData = csv;

    console.log(csvData);
    convertCsvToData();

    let html = generateHtml();

    $(parentSelector).append(html);

    $("td, th").hover(function() {
      $(`.${configClass}`).remove();

      console.dir($(this));

      if ($(this).find(`.${configActionsClass}`).length == 0) {
        $(this).append(_html_config_button);
      }
    });

    $("td input").focusin(function() {
      closeMenu();
    });

    $("table").on("click", `.${configClass}`, function() {
      let $td = $(this).parent();
      closeMenu();

      $td.addClass(`${configEnabledClass}`);
      $td.append(_html_config_actions);

      //index
      let row = $td
        .parent()
        .parent()
        .find("tr")
        .index($td.parent());
      let col = $td
        .parent()
        .find("td")
        .index($td);
      console.log(`Row: ${row} Col: ${col}`);
    });
  };

  let closeMenu = function() {
    $(`.${configClass}`).remove();
    $(`.${configEnabledClass}`).removeClass();
    $(`.${configActionsClass}`).remove();
  };

  let getData = function(tableId) {
    let data = "";

    let tr = $("#" + tableId + " tbody tr");

    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].children;
      let rowStr = "";
      let numberOfColumns = td.length;

      for (let j = 0; j < numberOfColumns; j++) {
        let el = td[j].children[0];

        let value = "";

        if (el.tagName === "INPUT") {
          value = el.value;
        }

        if (el.tagName === "DIV") {
          value = el.innerText;
        }

        rowStr += j + 1 === numberOfColumns ? value : value + ",";
      }

      data += rowStr + "\n";
    }

    return data;
  };

  let convertCsvToData = function() {
    let linesArray = csvData.split("\n");
    let rows = [];

    for (let i = 0; i < linesArray.length; i++) {
      if (checkIsComment(linesArray[i])) {
        rows.push({ type: "comment", value: linesArray[i] });
        continue;
      }

      let columns = linesArray[i].split(",");

      if (i === 0) {
        rows.push({ type: "header", value: columns });
        continue;
      }

      for (let j = 0; j < columns.length; j++) {
        columns[j] = columns[j].trim();
      }

      rows.push({ type: "data", value: columns });
    }

    console.log(rows);
    csvArray = rows;
  };

  let checkIsComment = function(row) {
    return row.trim().startsWith("*");
  };

  let generateHtml = function() {
    let html =
      `<table class="csv-table" id=` +
      id +
      `>
    <tbody>`;
    let columnsCount = csvArray[0].value.length;

    for (let i = 0; i < csvArray.length; i++) {
      let row = csvArray[i];
      let type = row.type;

      if (type === "comment") {
        html =
          html +
          `<tr><td colspan="` +
          columnsCount +
          `"><div class="editable-text" contenteditable="true">` +
          row.value +
          `</div></td></tr>`;
        continue;
      }

      html = html + `<tr>`;
      for (let j = 0; j < columnsCount; j++) {
        let cellValue = row.value[j];

        if (type === "header") {
          html =
            html +
            `<th><input class="cell-input-text" type="text" value="` +
            cellValue +
            `" /></th>`;
          continue;
        }

        if (type === "data") {
          if (row.value[j]) {
            html =
              html +
              `<td> <input class="cell-input-text" type="text" value="` +
              cellValue +
              `" /> </td>`;
          } else {
            html =
              html +
              `<td> <input class="cell-input-text" type="text" value="" /> </td>`;
          }
          continue;
        }
      }
      html = html + `</tr>`;
    }
    html = html + `</table>`;

    /*
    html = html + `</tbody>
  <tfoot>
    <tr>
      <td colspan="`+ columnsCount  +`">
        <div class='action-button'>Add Row</div>
        <div class='action-button'>Add Comment</div>
      </td>
    </tr>
  </tfoot></table>`
    */
    return html;
  };

  return {
    init: init,
    getData: getData
  };
})();

//--------------------------------------------------------------

console.clear();

let parentSelector = "#container";
let tableId = "user-data";
CSVeditor.init(parentSelector, tableId, testData);

$("#submit").on("click", function() {
  let jsonData = CSVeditor.getData(tableId);
  console.log(jsonData);
  alert("Check console logs");
});
