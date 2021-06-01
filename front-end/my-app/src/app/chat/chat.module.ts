import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { MaterialModule } from '../angularMaterial/material/material.module';
import { ChatComponent } from './chat-component/chat.component';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { ChatLeftPanelComponent } from './chat-left-panel/chat-left-panel.component';
import { MainChatComponent } from './main-chat/main-chat.component';


@NgModule({
  declarations: [
    ChatHeaderComponent,
    ChatLeftPanelComponent,
    ChatComponent,
    MainChatComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MaterialModule
  ]
})
export class ChatModule { }
