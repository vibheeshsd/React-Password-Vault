import React, { Component } from "react";
import { render } from "react-dom";
import { Table } from "antd";
import { Modal } from "antd";
import "./styles.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchtext: "",
      newDomain: "",
      newUsername: "",
      newPassword: "",
      credentials: [
        {
          key: "1",
          site: "www.gokil.com",
          username: "vaibees",
          password: "gumar",
          show: false,
        },
        {
          key: "2",
          site: "www.gopal.com",
          username: "vijaaai",
          password: "boxx",
          show: false,
        },
      ],
      visible: false,
    };
    this.columns = [
      { title: "Site", dataIndex: "site", key: "site" },

      { title: "UserName", dataIndex: "username", key: "usemname" },

      {
        title: "Password",
        dataIndex: "password",
        key: "password",
        render: (data, record) => {
          // console.log(record.show,data)
          if (record.show === true) {
            return data;
          }
          return "*".repeat(record.password.length);
        },
      },
      {
        title: "Visibility",
        key: "action",
        render: (record) => {
          if (record.show === false) {
            return (
              <button
                onClick={() => {
                  var temp = JSON.parse(JSON.stringify(this.state.credentials));
                  for (var i = 0; i < temp.length; i++) {
                    if (temp[i].key === record.key) {
                      temp[i].show = true;
                      break;
                    }
                  }
                  this.setState({ credentials: temp });
                }}
              >
                unhide
              </button>
            );
          } else {
            return (
              <button
                onClick={() => {
                  var temp = JSON.parse(JSON.stringify(this.state.credentials));
                  for (var i = 0; i < temp.length; i++) {
                    if (temp[i].key === record.key) {
                      temp[i].show = false;
                      break;
                    }
                  }
                  this.setState({ credentials: temp });
                }}
              >
                hide
              </button>
            );
          }
        },
      },

      {
        title: "Action",
        key: "action",
        render: (record) => {
          console.log("creds");

          console.log(this.state.credentials);

          return (
            <button
              onClick={() => {
                var temp1 = JSON.parse(JSON.stringify(this.state.credentials));

                for (var i = 0; i < temp1.length; i++) {
                  console.log(temp1[i]);
                  if (temp1[i].key === record.key) {
                    temp1.splice(i, 1);
                  }
                }
                this.setState({ credentials: temp1 });
              }}
            >
              Delete
            </button>
          );
        },
      },
    ];
  }
  filter = (searchtext) => {
    if (searchtext.length == 0) {
      console.log(window.cache);
      this.setState({ credentials: JSON.parse(JSON.stringify(window.cache)) });
      delete window.cache;
      return;
    }
    if (searchtext.length === 1 && window.cache == undefined) {
      window.cache = JSON.parse(JSON.stringify(this.state.credentials));
    }
    var search = searchtext;
    var temp = [];
    if (window.cache) {
      temp = JSON.parse(JSON.stringify(window.cache));
    } else {
      temp = JSON.parse(JSON.stringify(this.state.credentials));
    }
    var newtemp = [];
    for (var tempobj of temp) {
      if (
        tempobj.site.toLowerCase().includes(search.toLowerCase()) ||
        tempobj.username.toLowerCase().includes(search.toLowerCase())
      ) {
        newtemp.push(tempobj);
      }
    }

    this.setState({ credentials: newtemp });
  };
  // typevibeeshname = () =>{
  //   console.log('bibeesh');
  // }
  generatePassword = (
    length = 10,
    characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$"
  ) => {
    return Array.from(crypto.getRandomValues(new Uint32Array(length)))
      .map((x) => characters[x % characters.length])
      .join("");
  };

  addData = () => {
    var temp = JSON.parse(JSON.stringify(this.state.credentials));
    var tempkey = parseInt(temp[temp.length - 1].key) + 1;
    temp.push({
      key: tempkey.toString(),
      site: this.state.newDomain,
      username: this.state.newUsername,
      password: this.state.newPassword,
      show: false,
    });
    this.setState({
      credentials: temp,
      visible: false,
      newUsername: "",
      newPassword: "",
      newDomain: "",
    });
  };
  render() {
    console.log(window.cache);
    return (
      <>
        <div className="form-wrapper">
          <Modal
            title="Add Credentials"
            centered
            open={this.state.visible}
            onOk={this.addData}
            onCancel={() => this.setState({ visible: false })}
            width={1000}
          >
            <div className="site-wrapper">
              <input
                className="site"
                onChange={(e) => {
                  this.setState({ newDomain: e.target.value });
                }}
                type="text"
                placeholder="Enter domain"
                value={this.state.newDomain}
              ></input>
            </div>
            <div className="user-wrapper">
              <input
                className="user-name"
                onChange={(e) => {
                  this.setState({ newUsername: e.target.value });
                }}
                type="text"
                placeholder="Enter User Name"
                value={this.state.newUsername}
              ></input>
            </div>
            <div className="pass-wrapper">
              <input
                className="pass"
                type="password"
                onChange={(e) => {
                  this.setState({ newPassword: e.target.value });
                }}
                placeholder="Enter Password"
                value={this.state.newPassword}
              ></input>
              <button
                type="submit"
                className="generate-pass"
                onClick={() => {
                  this.setState({ newPassword: this.generatePassword() });
                }}
              >
                Suggest Password
              </button>
            </div>
          </Modal>
          <div className="search-container">
            <div class="inpboxwrap">
              <input
                type="text"
                class="inpbox"
                value={this.state.searchtext}
                placeholder="Search"
                onChange={(e) => {
                  this.setState({ searchtext: e.target.value });
                  this.filter(e.target.value);
                }}
              ></input>
            </div>
            <div class="add-button-wrap">
              <button
                className="add-button"
                onClick={() => {
                  this.setState({ visible: true });
                }}
              >
                +Creds
              </button>
            </div>
          </div>
        </div>
        <div className="table-wrapper">
          <Table
            title={() => "Credentials TABLE"}
            dataSource={this.state.credentials}
            bordered
            columns={this.columns}
          />
        </div>
      </>
    );
  }
}
export default App;
  