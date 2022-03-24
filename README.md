# todolist

Some notes about this project:
1. This project didn't go through SOLID check.
2. This project uses Class way of organization when it could have used factory functions and/or module patterns.
3. It still lacks two major features such as deleting projects and displaying week wrap tab because of time limits.
4. It uses localStorage to save and fetch data. And the way data is stored in localStorage has to be compatible with Class constructions to read and update.
5. There are 4 main popups: add task, edit task, notes, and add project.
6. There are 4 main "event listeners" parts: add task, tasks themselves, add project, and projects themselves.
7. It uses webpack and live preview is not available.


Bugs and lessons learned from this 1-week project:
1. Working with innerHTML and event listeners
2. Filter and handle input carefully (won't necessarily realize until using those data later)
3. Watch out events triggered twice (propagation problems)
4. Consistent and unambiguous and concrete variable/parameter/function naming

Date: 03/22/2022
