const fs = require("fs");
const csv = require("csv-parser");

var SQL = (SQLDOWN = "");

var leftPad = (value) => {
  return value.length < 2 ? "0" + value : value;
};

fs.createReadStream("file.csv")
  .pipe(csv())
  .on("data", function (data) {
    try {
      var dt = data.DATA.split("/");

      if (dt[0] && dt[1] && dt[2]) {
        const date = dt[2] + "-" + leftPad(dt[1]) + "-" + leftPad(dt[0]);
        SQL +=
          "UPDATE `acelera`.`Stores` SET `rollout_date` = '" +
          date +
          "' WHERE (`store_id` = '" +
          data.IBM +
          "');";

        SQLDOWN +=
          "UPDATE `acelera`.`Stores` SET `rollout_date` = null WHERE (`store_id` = '" +
          data.IBM +
          "');";
      } else {
        console.log(dt);
      }
    } catch (err) {
      console.log(err);
    }
  })
  .on("end", function () {
    //some final operation
    fs.writeFile(
      "./scripts/20211123202058-import_data_rollout_store.up.sql",
      SQL,
      (err) => {
        if (err) throw err;
        console.log("O arquivo foi criado UP!");
      }
    );
    fs.writeFile(
      "./scripts/20211123202058-import_data_rollout_store.down.sql",
      SQLDOWN,
      (err) => {
        if (err) throw err;
        console.log("O arquivo foi criado DOWN!");
      }
    );
  });
