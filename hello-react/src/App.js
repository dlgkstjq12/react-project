import React, {Component} from 'react';


//state는 자기자신, props는 부모를 지칭할때 사용, 함수나 변수를 사용할때 반드시 붙여야 사용 가능
class App extends Component {
  state = {
    maxNo: 3,   //글번호
    boards: [   //초기화면에 보여질 게시글 리스트
      {
        brdno: 1,
        brdwriter: 'Lee SunSin',
        brdtitle: 'If you intend to live then you die',
        brddate: new Date()
      },
      {
        brdno: 2,
        brdwriter: 'So SiNo',
        brdtitle: 'Founder for two countries',
        brddate: new Date()
      }
    ],
    selectedBoard:{}  //내가 선택한 게시글
  }


//데이터를 삭제하는 함수
//filter은 요소들을 걸러내는 메소드, 내가 삭제하고자하는 글번호와 내가 선택한 글의 번호가 일치할때만 담음
  handleRemove = (brdno) => {
      this.setState({
          boards: this.state.boards.filter(row => row.brdno !== brdno)
      });
  }


//데이터를 저장하는 함수
  handleSaveData = (data) => {
    let boards = this.state.boards;
    if(data.brdno === null || data.brdno === '' || data.brdno === undefined){   //가져온 게시글 번호가 없을 경우, 즉 새글로 작성할 경우에는 글번호를 새로 지정해서 저장
      this.setState({
          maxNo: this.state.maxNo+1,
          boards: this.state.boards.concat({ brdno:this.state.maxNo, brddate: new Date(), brdwriter:data.brdwriter, brdtitle:data.brdtitle})
      });
    }else {
      this.setState({
          boards: boards.map( row => data.brdno === row.brdno ? {brdno: data.brdno, brddate: data.brddate, brdwriter: data.brdwriter, brdtitle:data.brdtitle} : row)
      })
    }
  }

  handleSelectRow = (row) => {
        this.setState({selectedBoard:row});
  }

  render() {
    const {boards, selectedBoard} = this.state;
    return (
      <div>
        <BoardForm selectedBoard={selectedBoard} onSaveData={this.handleSaveData}/>
        <table border = "1">
          <tbody align = "center">
            <tr align = "center">
              <td width = "50">선택</td>
              <td width = "50">No.</td>
              <td width = "300">Title</td>
              <td width = "100">Name</td>
              <td width = "100">Date</td>
            </tr>
            {
              boards.map(row =>
                 (<BoardItem key={row.brdno} row={row} onRemove={this.handleRemove} onSelectRow={this.handleSelectRow}/>)
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}


class BoardItem extends React.Component {

//행선택
  handleSelectRow = () => {
    const { row, onSelectRow } = this.props;
    onSelectRow(row);
  }

//행삭제
  handleRemove = () => {
      const { row, onRemove } = this.props;
      onRemove(row.brdno);
  }
  render() {
    console.log(this.props.row.brdno);
    return(
      <tr>
        <td><input type ="checkbox" values = {this.props.row.brdno} /><a onClick={this.handleSelectRow}></a></td>
        <td>{this.props.row.brdno}</td>
        <td><a onClick={this.handleSelectRow}>{this.props.row.brdtitle}</a></td>
        <td>{this.props.row.brdwriter}</td>
        <td>{this.props.row.brddate.toLocaleDateString('ko-KR')}</td>
        <td><button onClick={this.handleRemove}>X</button></td>
      </tr>
    );
  }
}


//타이틀과 이름을 저장해서 부모 클래스로 전송하는 클래스
class BoardForm extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    let selectedBoard = nextProps.selectedBoard;
    if (!selectedBoard.brdno) {
        this.brdtitle.value = "";
        this.brdwriter.value = "";
        return true;
    }

    this.brdtitle.value = selectedBoard.brdtitle;
    this.brdwriter.value = selectedBoard.brdwriter;
    return true;
  }

  handleSubmit = (e) => {
      e.preventDefault();
      let selectedBoard = this.props.selectedBoard;
      let data = {
          brdwriter: this.brdwriter.value,
          brdtitle: this.brdtitle.value
      }
      if (selectedBoard.brdno) {
          data.brdno = selectedBoard.brdno;
          data.brddate = selectedBoard.brddate;
      }
      this.props.onSaveData(data);
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
          <input placeholder="title" ref={node => this.brdtitle = node}/>
          <input placeholder="name" ref={node => this.brdwriter = node}/>
          <button type="submit">Save</button>
      </form>
      );
    }
  }


export default App;
