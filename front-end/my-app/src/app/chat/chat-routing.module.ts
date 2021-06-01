import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat-component/chat.component';
import { MainChatComponent } from './main-chat/main-chat.component';

const routes: Routes = [
  {
    path: 'chat', component: ChatComponent
  },
  {
    path: 'messages/:id', component: MainChatComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
