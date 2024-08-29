# WorkClever

🏆 Open source, free project management/issue tracking software to manage your work and projects

## Features

### General

- Free to use, open source
- Kanban board with drag/drop functionality
- Custom fields to extend the tasks based on spesific project requirements
- Multiple projects and boards
- Multiple admins and project based user access management
- User collaboration

### Tasks

- Task assigning to a user
- Commenting on a task
- Subtasks
- Easy task and column creation
- Uploading/attaching files to a task
- Custom task relation types (blocking, duplicating etc..)

### Images 🖼️ 🖼️

#### Board as kanban

[![Board as kanban](https://i.gyazo.com/2ec089944b9100aabfe5a233a8d51938.gif)](https://gyazo.com/2ec089944b9100aabfe5a233a8d51938)

#### Board as list

[![Board as list](https://i.gyazo.com/dac0f47e0bafb8351de72d5ad627bfaf.gif)](https://gyazo.com/dac0f47e0bafb8351de72d5ad627bfaf)

#### Task detail

[![Task detail](https://i.gyazo.com/94f1bc47ffc17c09a2a9c8143986cadc.png)](https://gyazo.com/94f1bc47ffc17c09a2a9c8143986cadc)

#### Project settings

[![Project settings](https://i.gyazo.com/f3cced6ca6f23baae065a59e6bceb38b.gif)](https://gyazo.com/f3cced6ca6f23baae065a59e6bceb38b)

#### Custom fields

[![Custom fields](https://i.gyazo.com/6d3f0e4a7e405277f919b8336f83f7b5.png)](https://gyazo.com/6d3f0e4a7e405277f919b8336f83f7b5)

#### Site settings

[![Site settings](https://i.gyazo.com/62dcf740f2e6616108d17465943eb387.gif)](https://gyazo.com/62dcf740f2e6616108d17465943eb387)

### Installation & running

Execute following commands to run the application.

```bash
git clone https://github.com/workclever/frontend.git
cd frontend
yarn
yarn start

```

By default, it will try to connect to `localhost:5001` to access to API.

Execute following commands to run the API (backend) application.

```bash
git clone https://github.com/workclever/backend.git
cd backend/WorkCleverSolution
dotnet build
dotnet run
```

### Used technologies

- Reactjs
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) for data fetching and storing
- [Ant Design](https://ant.design) for most of UI components
- [Ant Design Pro Components](https://procomponents.ant.design) for crud and forms
- [Elastic UI](https://elastic.github.io/eui/#/) for editor
- [@ant-design/colors](https://npmjs.com/package/@ant-design/colors) for colors
- [Dnd Kit](https://github.com/clauderic/dnd-kit) for Drag drop

### TODO

- User forgot password flow
- User invite flow
- E2E Tests
- Improve `any` usage to appropriate types (tech debt)
