# 角色配音

游戏默认通过同源 `/api/tts` 使用普通话神经语音。`voice-cast.json` 是唯一声线表，包含旁白和全部 35 名角色的基础声线、性别、表演方向、语速与音高；服务端和浏览器回退共用这份配置。

旁白固定使用 `zh-CN-YunyangNeural`，该声线适合专业、可靠的播音表达。悟空使用活泼青年男声，石猴、红孩儿和哪吒使用少年男声，观音、白骨精、铁扇公主、王母与女王使用女声。其余角色按年龄、身份和性格分别调校，36 组声线签名互不重复。

## 启动

```bash
python3 -m pip install -r requirements-voice.txt
python3 voice_server.py --port 4174
```

打开 `http://127.0.0.1:4174/`。健康检查位于 `/api/health`，完整配音表位于 `/api/voices`。

`voice_server.py` 同时提供静态文件与语音接口，避免跨域。合成结果保存在有界内存缓存中，不写入项目目录。章节题签显示时会预取前两句，每次播放还会预取下一句；浏览器端只保留最近 18 条语音。服务不可用或断网时，`voice-adapter.js` 会按角色性别和声线偏好回退到浏览器中文语音；演出旁注始终不朗读。

## 技术来源

- [edge-tts](https://github.com/rany2/edge-tts) 是无需 Windows 或浏览器即可调用 Edge 在线语音服务的开源 Python 客户端，本项目固定使用 `7.2.8`。
- [微软中文语音表](https://learn.microsoft.com/azure/ai-services/speech-service/language-support?tabs=tts) 用于核对声线性别与官方人格标签。
- 若后续要求完全离线或使用经授权的真人定制音色，可以把同一 `/api/tts` 契约替换为 [CosyVoice](https://github.com/FunAudioLLM/CosyVoice)；前端角色映射无需改动。

`edge-tts` 客户端是开源软件，但实际合成依赖在线语音服务。正式发行前应根据发行方式核对服务条款；定制真人音色必须使用已获授权的录音。
