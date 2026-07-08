# Plugin máy chủ MCP cho Cocos Creator

🌐 [简体中文](README.md) · [English](README.EN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português](README.pt.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · **Tiếng Việt**

Một plugin máy chủ MCP (Model Context Protocol) toàn diện dành cho Cocos Creator 3.8+, cho phép các trợ lý AI tương tác với trình biên tập Cocos Creator thông qua giao thức chuẩn hóa. Cài đặt và sử dụng chỉ với một thao tác, giúp bạn bỏ qua mọi cấu hình môi trường rườm rà. Đã được kiểm thử với Claude Desktop, Claude CLI và Cursor; về mặt lý thuyết, các trình biên tập khác cũng được hỗ trợ hoàn hảo.

**🚀 Hiện đã cung cấp 50 công cụ tích hợp mạnh mẽ, đạt 99% khả năng điều khiển trình biên tập!**

## Phiên bản PRO đã được cập nhật lên 1.7.8

| Loại | Liên kết |
|------|------|
| **Video xem trước** | [Video Bilibili](https://www.bilibili.com/video/BV1rTAXzuEH3/) |
| **Trải nghiệm miễn phí** | [Trang trải nghiệm vberai cocos creator phiên bản 3.x Pro](https://www.vberai.com/game-engines/cocos) |
| **Trải nghiệm miễn phí** | [Trang trải nghiệm vberai cocos creator phiên bản 2.x Pro](https://www.vberai.com/game-engines/cocos2x) |
| **Bảng vẽ thiết kế AI** | [VberAI Studio —— Nền tảng thiết kế AI gốc cho game đầu tiên trên thế giới](https://studio.vberai.com) |
| **Trang chủ** | [Trang chủ VberAI vberai.com](https://www.vberai.com) |

## Tính năng phiên bản Cocos MCP 3.x Pro

> 🚀 Phiên bản Pro được xây dựng và duy trì liên tục bởi **VberAI** —— [Trải nghiệm ngay phiên bản Pro](https://www.vberai.com/game-engines/cocos) ｜ [Xem video minh họa](https://www.bilibili.com/video/BV1rTAXzuEH3/)

Một plugin MCP (Model Context Protocol) chuyên nghiệp được xây dựng riêng cho **Cocos Creator 3.8.6+**, cho phép trợ lý AI điều khiển trực tiếp trình biên tập thông qua giao thức chuẩn hóa. **16 công cụ cấp ý định** bao phủ **231 thao tác**, trải rộng trên **12 mô-đun năng lực lớn**, xuyên suốt toàn bộ quy trình phát triển của Cocos Creator 3.x. Sử dụng giao thức Streamable HTTP, kết hợp thiết kế tối ưu Token giúp tiết kiệm Token hơn và gọi lệnh ổn định hơn, hỗ trợ cấu hình một chạm cho các ứng dụng AI phổ biến (Cursor, Claude, Windsurf, v.v.).

| Công cụ cấp ý định | Thao tác bao phủ | Mô-đun bao phủ | Giao thức truyền thông |
|:---:|:---:|:---:|:---:|
| **16** | **231** | **12 mô-đun lớn** | **Streamable HTTP** |

### Mười hai mô-đun năng lực lớn

| Mô-đun | Số thao tác | Mô tả |
|------|---:|------|
| Quản lý cảnh | 24 | Mở, lưu, tạo và chuyển đổi cảnh, truy vấn cấu trúc phân cấp và chụp nhanh (snapshot), hỗ trợ hoàn tác thao tác và thực thi script. |
| Thao tác nút | 18 | CRUD đầy đủ cho nút, hỗ trợ chỉnh sửa hàng loạt, gắn script, phát hiện loại nút và thao tác clipboard. |
| Hệ thống thành phần | 8 | Thêm, xóa, truy vấn, sửa thành phần và thiết lập thuộc tính, hỗ trợ liên kết sự kiện nhấp chuột và cấu hình sự kiện hàng loạt. |
| Hệ thống Prefab | 13 | Tạo, khởi tạo thực thể, chuyển đổi chế độ chỉnh sửa Prefab, hỗ trợ áp dụng/khôi phục thay đổi và xác thực Prefab. |
| Quản lý tài nguyên | 19 | Truy vấn, tìm kiếm, CRUD và nhập tài nguyên, hỗ trợ phân tích phụ thuộc, chuyển đổi giữa UUID và đường dẫn. |
| Điều khiển trình biên tập | 33 | Các thao tác cấp trình biên tập như cài đặt dự án, log, tùy chọn, build và xem trước. |
| Khung nhìn cảnh | 32 | Gizmo, camera, lưới và ảnh tham chiếu, cung cấp ngữ cảnh khung nhìn và điều khiển nhận biết ranh giới. |
| Xây dựng UI và mẫu | 13 | Tạo thành phần UI chỉ với một thao tác, dựng cây cấu trúc nút hoàn chỉnh từ cây JSON, tích hợp sẵn nhiều mẫu UI. |
| Hệ thống hoạt ảnh | 39 | Chỉnh sửa khung hình khóa, điều chỉnh đường cong, sự kiện hoạt ảnh, áp dụng preset, cùng quản lý hoạt ảnh xương Spine. |
| Truy vấn cơ sở tri thức | 8 | Cơ sở tri thức tích hợp sẵn về thuộc tính thành phần, quy tắc thiết kế UI, mẫu bố cục và các thực hành tốt nhất, giúp AI hỗ trợ phát triển chính xác. |
| Xác thực và chụp nhanh | 6 | Kiểm tra bố cục cảnh, xác thực tham chiếu tài nguyên, phân tích cấu trúc phân cấp, kết hợp chụp nhanh cảnh để kiểm tra hồi quy. |
| Font chữ và Label | 9 | Quản lý tài nguyên font chữ và thao tác Label văn bản đa định dạng (rich text), bao phủ các thiết lập sắp chữ. |

#### Tính năng thông minh

- **Phân giải đường dẫn thông minh** — Tất cả tham số nút đều chấp nhận UUID, đường dẫn (ví dụ `Canvas/Panel/Button`) hoặc tên, tự động phân giải
- **Tự động phát hiện UI** — Tự động thêm `cc.UITransform` khi tạo nút bên dưới nút cha thuộc UI
- **Ngữ cảnh khung nhìn (viewport)** — Trả về độ phân giải thiết kế, phạm vi hiển thị khi tạo/sửa nút, tự động cảnh báo khi vượt ra ngoài phạm vi
- **Cơ sở tri thức tích hợp sẵn** — AI có thể truy vấn kiến thức như bảng thuộc tính thành phần, quy tắc hệ tọa độ, mẫu bố cục
- **Trình dựng cảnh (Scene Builder)** — Mô tả toàn bộ cấu trúc phân cấp UI bằng JSON, dựng ra chỉ với một lần gọi, tự động xử lý cấu hình Canvas/Camera/thành phần
- **Hệ thống ảnh tham chiếu** — Phủ bản thiết kế UI lên trên khung nhìn cảnh, giúp AI nhìn theo bản thiết kế để dựng giao diện
- **Bộ nhớ đệm cây nút** — Bộ nhớ đệm với TTL 2 giây giúp tránh truy vấn lặp lại, tự động vô hiệu sau khi có thao tác thay đổi
- **Thao tác nguyên tử** — builder/composite sử dụng cơ chế snapshot, tự động khôi phục (rollback) khi thất bại

### Phiên bản Pro so với phiên bản mã nguồn mở

| Tính năng | Phiên bản mã nguồn mở | Phiên bản Pro |
|------|:---:|:---:|
| Giao thức truyền thông | Giao thức HTTP | **Streamable HTTP** |
| Tối ưu Token | Thiết kế cơ bản | Thiết kế tối ưu, tiết kiệm Token hơn và ổn định hơn |
| Phương thức mã thao tác | ✕ | ✅ |
| Cấu hình một chạm | ✕ | ✅ |
| Tùy biến công cụ | ✕ | ✅ |
| Công cụ cấp nhận diện ý định | Công cụ cơ bản | 16 loại, bao phủ 231 thao tác |
| Tạo cảnh một lần duy nhất | ✕ | ✅ |
| Cơ sở tri thức tích hợp sẵn | ✕ | ✅ |
| Hệ thống hoạt ảnh / Spine | ✕ | ✅ 39 thao tác hoạt ảnh |

---

## 🌐 Giới thiệu về VberAI —— Nền tảng năng suất game gốc AI

**VberAI** là **nền tảng năng suất game gốc AI (AI-native)** dành cho các nhà phát triển game, đội ngũ mỹ thuật và đội ngũ nội dung, đồng thời cũng là đơn vị phát triển và duy trì phiên bản Pro của plugin Cocos MCP này. VberAI hiện là **nhà cung cấp duy nhất đồng thời cung cấp plugin MCP cho cả ba engine chủ đạo Unity, Godot và Cocos Creator**, xây dựng ba dòng sản phẩm xoay quanh mục tiêu "đưa AI thực sự hòa nhập vào quy trình sản xuất game":

- **🎮 Plugin MCP cho engine game** —— Chạy dịch vụ MCP ngay bên trong trình biên tập của engine, cho phép các ứng dụng AI như Claude Desktop, Claude Code, Cursor, Windsurf, Cline đọc và thao tác trực tiếp với cảnh, thành phần, tài nguyên, hoạt ảnh và script.
- **🎨 AI Studio** —— Bảng vẽ thiết kế game gốc AI, một đầu nhập vào PSD / Figma / dự án engine, đầu còn lại xuất ra cảnh và Prefab cho Unity / Cocos / Godot.
- **✂️ AI Super Matting (AI Cắt nền siêu mạnh)** —— Cắt nền chỉ với một thao tác ngay trên trình duyệt, độ chính xác đến từng sợi tóc + xuất kênh Alpha thực, tính phí theo lượng sử dụng.

### Bộ sưu tập plugin MCP cho các engine

| Plugin | Mô tả |
|------|------|
| **Unity MCP** | Plugin MCP cấp doanh nghiệp, bao phủ Scene / GameObject / Component / Prefab / Material / Animation / Shader, hỗ trợ Unity 2022.3+ và Unity 6 |
| **Cocos MCP 3.x Pro** | Phiên bản Pro của dự án này, 16 công cụ cấp ý định / 231 thao tác, Cocos Creator 3.8.6+, Streamable HTTP |
| **Cocos MCP 2.x Pro** | Được thiết kế riêng cho các dự án cũ sử dụng Cocos Creator 2.4.x+ (các dự án 2.x vẫn đang vận hành) |
| **Godot MCP** | Hoàn toàn miễn phí, mã nguồn mở MIT, 100+ lệnh công cụ bao phủ 21 hệ thống, Godot 4.x, tương thích với GDScript và C# |


---

## 🎨 VberAI Studio —— Nền tảng thiết kế game gốc AI đầu tiên trên thế giới

> **Nền tảng thiết kế gốc AI sinh ra dành riêng cho game.** Tương thích với các engine Unity, Cocos, Godot ngay từ tầng nền tảng, cùng vô số công cụ AI tần suất cao và quy trình tự động hóa, giúp việc tạo hình ảnh, đổi skin chỉ với một thao tác, quản lý tài sản, và bàn giao tích hợp từ bản thiết kế đến engine trở nên liền mạch, cộng thêm khả năng hồi lưu ngược từ engine, khai thông hoàn toàn chuỗi phát triển "Thiết kế AI → AI trong engine game".
>
> 👉 **[Vào AI Studio ngay](https://studio.vberai.com)** ｜ [Tìm hiểu thêm](https://www.vberai.com/studio)


### Chuỗi sản xuất hoàn chỉnh

**Nhập bản thiết kế và tài sản dự án → AI sinh và chỉnh sửa tần suất cao → Bàn giao theo thành phần cho engine → Đồng bộ theo thời gian thực vào engine qua Engine MCP → Hồi lưu ngược từ engine**

Khi kết hợp với plugin Cocos MCP này, sau khi AI Studio ghi ngược cảnh, Prefab, thành phần và tài nguyên mỹ thuật vào dự án, Engine MCP cho phép AI tiếp tục hoàn thiện script, cấu hình thành phần, quản lý tài nguyên và gỡ lỗi ngay trong Cocos Creator, tạo thành một vòng khép kín phát triển từ đầu đến cuối —— nâng cao đáng kể hiệu suất của cả đội, thậm chí giúp một người có thể làm việc như cả một đội ngũ.

**🔗 Liên kết liên quan**: [Trang chủ VberAI](https://www.vberai.com) ｜ [AI Studio](https://studio.vberai.com) ｜ [AI Super Matting](https://www.vberai.com/ai-studio/bg-removal) ｜ [Bảng giá nền tảng](https://www.vberai.com/pricing) ｜ Liên hệ hỗ trợ: support@vberai.com

---


## Nhật ký cập nhật phiên bản mã nguồn mở

## 🚀 Cập nhật lớn v1.5.4

## Video minh họa phiên bản mã nguồn mở hiện tại

[<img width="503" height="351" alt="视频演示" src="https://github.com/user-attachments/assets/f186ce14-9ffc-4a29-8761-48bdd7c1ea16" />](https://www.bilibili.com/video/BV1mB8dzfEw8?spm_id_from=333.788.recommend_more_video.0&vd_source=6b1ff659dd5f04a92cc6d14061e8bb92)

- **Tinh giản và tái cấu trúc công cụ**: Cô đọng hơn 150 công cụ ban đầu thành 50 công cụ cốt lõi có khả năng tái sử dụng cao và độ bao phủ cao, loại bỏ toàn bộ mã dư thừa không hiệu quả, nâng cao đáng kể tính dễ sử dụng và khả năng bảo trì.
- **Thống nhất mã thao tác**: Tất cả công cụ đều áp dụng mô hình "mã thao tác + tham số", giúp đơn giản hóa đáng kể quy trình gọi của AI, nâng cao tỷ lệ gọi thành công, giảm số lần gọi và giảm 50% mức tiêu thụ Token.
- **Nâng cấp toàn diện tính năng Prefab**: Sửa lỗi và hoàn thiện triệt để toàn bộ các tính năng cốt lõi của Prefab như tạo, khởi tạo thực thể, đồng bộ, tham chiếu, hỗ trợ các quan hệ tham chiếu phức tạp, khớp 100% với định dạng chính thức.
- **Bổ sung liên kết sự kiện và các tính năng cũ**: Bổ sung và triển khai các tính năng cũ như liên kết sự kiện, nút/thành phần/tài nguyên, tất cả các phương thức đều khớp hoàn toàn với cách triển khai chính thức.
- **Tối ưu giao diện (API)**: Tham số của tất cả API rõ ràng hơn, tài liệu hoàn thiện hơn, giúp AI dễ hiểu và dễ gọi hơn.
- **Tối ưu bảng điều khiển plugin**: Giao diện bảng điều khiển gọn gàng hơn, thao tác trực quan hơn.
- **Nâng cao hiệu năng và khả năng tương thích**: Kiến trúc tổng thể hiệu quả hơn, tương thích với tất cả các phiên bản Cocos Creator 3.8.6 trở lên.


## Hệ thống công cụ và mã thao tác

- Tất cả công cụ đều được đặt tên theo dạng "danh_mục_thao_tác", tham số sử dụng Schema thống nhất, hỗ trợ chuyển đổi giữa nhiều mã thao tác (action), nâng cao đáng kể tính linh hoạt và khả năng mở rộng.
- 50 công cụ cốt lõi bao phủ toàn bộ các thao tác trong trình biên tập như cảnh, nút, thành phần, Prefab, tài nguyên, dự án, gỡ lỗi, tùy chọn cài đặt, máy chủ, phát sóng thông điệp.
- Ví dụ gọi công cụ:

```json
{
  "tool": "node_lifecycle",
  "arguments": {
    "action": "create",
    "name": "MyNode",
    "parentUuid": "parent-uuid",
    "nodeType": "2DNode"
  }
}
```

---

## Các nhóm tính năng chính (một số ví dụ)

- **scene_management**: Quản lý cảnh (lấy/mở/lưu/tạo mới/đóng cảnh)
- **node_query / node_lifecycle / node_transform**: Truy vấn, tạo, xóa nút, thay đổi thuộc tính
- **component_manage / component_script / component_query**: Thêm/xóa thành phần, gắn script, thông tin thành phần
- **prefab_browse / prefab_lifecycle / prefab_instance**: Duyệt, tạo, khởi tạo thực thể, đồng bộ Prefab
- **asset_manage / asset_analyze**: Nhập, xóa tài nguyên, phân tích phụ thuộc
- **project_manage / project_build_system**: Chạy dự án, build, thông tin cấu hình
- **debug_console / debug_logs**: Quản lý console và log
- **preferences_manage**: Tùy chọn cài đặt
- **server_info**: Thông tin máy chủ
- **broadcast_message**: Phát sóng thông điệp


### v1.4.0 - Ngày 26 tháng 7 năm 2025

#### 🎯 Sửa lỗi tính năng quan trọng
- **Sửa hoàn toàn tính năng tạo Prefab**: Giải quyết triệt để vấn đề mất tham chiếu loại thành phần/nút/tài nguyên khi tạo Prefab
- **Xử lý tham chiếu chính xác**: Triển khai định dạng tham chiếu hoàn toàn giống với việc tạo Prefab thủ công
  - **Tham chiếu nội bộ**: Tham chiếu nút và thành phần bên trong Prefab được chuyển đổi chính xác sang định dạng `{"__id__": x}`
  - **Tham chiếu bên ngoài**: Tham chiếu nút và thành phần bên ngoài Prefab được thiết lập chính xác thành `null`
  - **Tham chiếu tài nguyên**: Tham chiếu tài nguyên như Prefab, texture, sprite frame vẫn giữ nguyên định dạng UUID đầy đủ
- **Chuẩn hóa API gỡ bỏ thành phần/script**: Hiện tại khi gỡ bỏ thành phần/script, bắt buộc phải truyền vào cid của thành phần (trường type), không thể dùng tên script hoặc tên class. AI và người dùng nên dùng getComponents để lấy trường type (cid) trước, sau đó truyền vào removeComponent. Cách này giúp gỡ bỏ chính xác 100% mọi loại thành phần và script, tương thích với tất cả các phiên bản Cocos Creator.

#### 🔧 Cải tiến cốt lõi
- **Tối ưu thứ tự chỉ mục**: Điều chỉnh thứ tự tạo đối tượng Prefab, đảm bảo nhất quán với định dạng chuẩn của Cocos Creator
- **Hỗ trợ loại thành phần**: Mở rộng phát hiện tham chiếu thành phần, hỗ trợ tất cả các loại thành phần bắt đầu bằng cc. (Label, Button, Sprite, v.v.)
- **Cơ chế ánh xạ UUID**: Hoàn thiện hệ thống ánh xạ từ UUID nội bộ sang chỉ mục, đảm bảo quan hệ tham chiếu được thiết lập chính xác
- **Chuẩn hóa định dạng thuộc tính**: Sửa thứ tự và định dạng thuộc tính thành phần, loại bỏ lỗi phân tích cú pháp của engine

#### 🐛 Sửa lỗi
- **Sửa lỗi nhập Prefab**: Giải quyết lỗi `Cannot read properties of undefined (reading '_name')`
- **Sửa lỗi tương thích engine**: Giải quyết lỗi `placeHolder.initDefault is not a function`
- **Sửa lỗi ghi đè thuộc tính**: Ngăn các thuộc tính quan trọng như `_objFlags` bị dữ liệu thành phần ghi đè
- **Sửa lỗi mất tham chiếu**: Đảm bảo mọi loại tham chiếu đều được lưu và tải chính xác

#### 📈 Tăng cường tính năng
- **Giữ nguyên đầy đủ thuộc tính thành phần**: Bao gồm tất cả các thuộc tính thành phần, kể cả thuộc tính riêng tư (như _group, _density, v.v.)
- **Hỗ trợ cấu trúc nút con**: Xử lý chính xác cấu trúc phân cấp và quan hệ nút con của Prefab
- **Xử lý thuộc tính biến đổi (transform)**: Giữ nguyên thông tin vị trí, xoay, tỷ lệ và cấp độ (layer) của nút
- **Tối ưu thông tin gỡ lỗi**: Thêm log xử lý tham chiếu chi tiết, thuận tiện cho việc truy vết vấn đề

#### 💡 Đột phá kỹ thuật
- **Nhận diện loại tham chiếu**: Phân biệt thông minh giữa tham chiếu nội bộ và tham chiếu bên ngoài, tránh tham chiếu không hợp lệ
- **Khả năng tương thích định dạng**: Prefab được tạo ra tương thích 100% với định dạng của Prefab tạo thủ công
- **Tích hợp engine**: Prefab có thể gắn vào cảnh một cách bình thường, không có bất kỳ lỗi runtime nào
- **Tối ưu hiệu năng**: Tối ưu quy trình tạo Prefab, nâng cao hiệu suất xử lý các Prefab lớn

**🎉 Hiện tại tính năng tạo Prefab đã hoàn toàn khả dụng, hỗ trợ các quan hệ tham chiếu thành phần phức tạp và cấu trúc Prefab đầy đủ!**

### v1.3.0 - Ngày 25 tháng 7 năm 2024

#### 🆕 Tính năng mới
- **Tích hợp bảng quản lý công cụ**: Bổ sung trực tiếp tính năng quản lý công cụ toàn diện vào bảng điều khiển chính
- **Hệ thống cấu hình công cụ**: Triển khai khả năng bật/tắt công cụ có chọn lọc, hỗ trợ lưu cấu hình lâu dài
- **Tải công cụ động**: Tăng cường tính năng khám phá công cụ, có thể tải động toàn bộ 158 công cụ khả dụng trong máy chủ MCP
- **Quản lý trạng thái công cụ theo thời gian thực**: Bổ sung cập nhật theo thời gian thực cho số lượng và trạng thái công cụ, phản ánh ngay lập tức khi từng công cụ được chuyển đổi
- **Lưu cấu hình lâu dài**: Tự động lưu và tải cấu hình công cụ giữa các phiên làm việc của trình biên tập

#### 🔧 Cải tiến
- **Thống nhất giao diện bảng điều khiển**: Gộp quản lý công cụ vào bảng máy chủ MCP chính dưới dạng tab, loại bỏ nhu cầu về bảng điều khiển riêng
- **Tăng cường cài đặt máy chủ**: Cải thiện quản lý cấu hình máy chủ, với khả năng lưu và tải tốt hơn
- **Tích hợp Vue 3**: Nâng cấp lên Vue 3 Composition API, mang lại khả năng phản ứng (reactivity) và hiệu năng tốt hơn
- **Xử lý lỗi tốt hơn**: Bổ sung xử lý lỗi toàn diện, bao gồm cơ chế khôi phục (rollback) cho các thao tác thất bại
- **Cải thiện UI/UX**: Tăng cường thiết kế trực quan, bao gồm dấu phân cách phù hợp, kiểu khối riêng biệt và nền modal không trong suốt

#### 🐛 Sửa lỗi
- **Sửa lỗi lưu trạng thái công cụ**: Giải quyết vấn đề trạng thái công cụ bị đặt lại khi chuyển tab hoặc mở lại bảng điều khiển
- **Sửa lỗi tải cấu hình**: Khắc phục vấn đề tải cài đặt máy chủ và vấn đề đăng ký thông điệp
- **Sửa lỗi tương tác checkbox**: Giải quyết vấn đề không thể bỏ chọn checkbox và cải thiện khả năng phản hồi
- **Sửa lỗi cuộn bảng điều khiển**: Đảm bảo chức năng cuộn hoạt động chính xác trong bảng quản lý công cụ
- **Sửa lỗi giao tiếp IPC**: Giải quyết nhiều vấn đề giao tiếp IPC khác nhau giữa frontend và backend

#### 🏗️ Cải tiến kỹ thuật
- **Đơn giản hóa kiến trúc**: Loại bỏ sự phức tạp của đa cấu hình, tập trung vào quản lý cấu hình đơn nhất
- **An toàn kiểu dữ liệu tốt hơn**: Tăng cường định nghĩa kiểu TypeScript và interface
- **Cải thiện đồng bộ dữ liệu**: Đồng bộ tốt hơn giữa trạng thái UI frontend và trình quản lý công cụ backend
- **Tăng cường gỡ lỗi**: Bổ sung ghi log toàn diện và tính năng gỡ lỗi

#### 📊 Thông tin thống kê
- **Tổng số công cụ**: Tăng từ 151 lên 158 công cụ
- **Danh mục**: 13 danh mục công cụ, bao phủ toàn diện
- **Điều khiển trình biên tập**: Đạt độ bao phủ 98% tính năng trình biên tập

### v1.2.0 - Phiên bản trước
- Phát hành ban đầu, bao gồm 151 công cụ
- Chức năng máy chủ MCP cơ bản
- Thao tác cảnh, nút, thành phần và Prefab
- Công cụ điều khiển dự án và gỡ lỗi



## Sử dụng nhanh

**Cấu hình Claude CLI:**

```
claude mcp add --transport http cocos-creator http://127.0.0.1:3000/mcp（sử dụng cổng bạn tự cấu hình）
```

**Cấu hình Claude Desktop:**

```
{

  "mcpServers": {

		"cocos-creator": {

 		"type": "http",

		"url": "http://127.0.0.1:3000/mcp"

		 }

	  }

}
```

**Cấu hình MCP cho Cursor hoặc các IDE giống VS Code**

```
{

  "mcpServers": { 

   "cocos-creator": {
      "url": "http://localhost:3000/mcp"
   }
  }

}
```

## Tính năng

### 🎯 Thao tác cảnh (scene_*)
- **scene_management**: Quản lý cảnh - lấy cảnh hiện tại, mở/lưu/tạo/đóng cảnh, hỗ trợ truy vấn danh sách cảnh
- **scene_hierarchy**: Cấu trúc phân cấp cảnh - lấy cấu trúc cảnh đầy đủ, hỗ trợ bao gồm thông tin thành phần
- **scene_execution_control**: Điều khiển thực thi - thực thi phương thức thành phần, script cảnh, đồng bộ Prefab

### 🎮 Thao tác nút (node_*)
- **node_query**: Truy vấn nút - tìm nút theo tên/mẫu, lấy thông tin nút, phát hiện loại 2D/3D
- **node_lifecycle**: Vòng đời nút - tạo/xóa nút, hỗ trợ cài sẵn thành phần, khởi tạo thực thể từ Prefab
- **node_transform**: Biến đổi nút - sửa tên nút, vị trí, xoay, tỷ lệ, khả năng hiển thị và các thuộc tính khác
- **node_hierarchy**: Cấu trúc phân cấp nút - di chuyển, sao chép, dán nút, hỗ trợ thao tác cấu trúc phân cấp
- **node_clipboard**: Clipboard nút - thao tác sao chép/dán/cắt nút
- **node_property_management**: Quản lý thuộc tính - đặt lại thuộc tính nút, thuộc tính thành phần, thuộc tính biến đổi

### 🔧 Thao tác thành phần (component_*)
- **component_manage**: Quản lý thành phần - thêm/xóa thành phần engine (cc.Sprite, cc.Button, v.v.)
- **component_script**: Thành phần script - gắn/gỡ thành phần script tùy chỉnh
- **component_query**: Truy vấn thành phần - lấy danh sách thành phần, thông tin chi tiết, các loại thành phần khả dụng
- **set_component_property**: Thiết lập thuộc tính - đặt giá trị một hoặc nhiều thuộc tính thành phần

### 📦 Thao tác Prefab (prefab_*)
- **prefab_browse**: Duyệt Prefab - liệt kê Prefab, xem thông tin, xác thực tệp
- **prefab_lifecycle**: Vòng đời Prefab - tạo Prefab từ nút, xóa Prefab
- **prefab_instance**: Thực thể Prefab - khởi tạo vào cảnh, hủy liên kết, áp dụng thay đổi, khôi phục nguyên bản
- **prefab_edit**: Chỉnh sửa Prefab - vào/thoát chế độ chỉnh sửa, lưu Prefab, kiểm tra thay đổi

### 🚀 Điều khiển dự án (project_*)
- **project_manage**: Quản lý dự án - chạy dự án, build dự án, lấy thông tin và cài đặt dự án
- **project_build_system**: Hệ thống build - điều khiển bảng build, kiểm tra trạng thái build, quản lý máy chủ xem trước

### 🔍 Công cụ gỡ lỗi (debug_*)
- **debug_console**: Quản lý console - lấy/xóa log console, hỗ trợ lọc và giới hạn
- **debug_logs**: Phân tích log - đọc/tìm kiếm/phân tích tệp log dự án, hỗ trợ khớp mẫu
- **debug_system**: Gỡ lỗi hệ thống - lấy thông tin trình biên tập, thống kê hiệu năng, thông tin môi trường

### 📁 Quản lý tài nguyên (asset_*)
- **asset_manage**: Quản lý tài nguyên - nhập/xóa tài nguyên hàng loạt, lưu metadata, tạo URL
- **asset_analyze**: Phân tích tài nguyên - lấy quan hệ phụ thuộc, xuất danh sách tài nguyên
- **asset_system**: Hệ thống tài nguyên - làm mới tài nguyên, truy vấn trạng thái cơ sở dữ liệu tài nguyên
- **asset_query**: Truy vấn tài nguyên - truy vấn tài nguyên theo loại/thư mục, lấy thông tin chi tiết
- **asset_operations**: Thao tác tài nguyên - tạo/sao chép/di chuyển/xóa/lưu/nhập lại tài nguyên

### ⚙️ Tùy chọn cài đặt (preferences_*)
- **preferences_manage**: Quản lý tùy chọn - lấy/đặt tùy chọn cài đặt trình biên tập
- **preferences_global**: Cài đặt toàn cục - quản lý cấu hình toàn cục và cài đặt hệ thống

### 🌐 Máy chủ và phát sóng (server_* / broadcast_*)
- **server_info**: Thông tin máy chủ - lấy trạng thái máy chủ, chi tiết dự án, thông tin môi trường
- **broadcast_message**: Phát sóng thông điệp - lắng nghe và phát sóng thông điệp tùy chỉnh

### 🖼️ Ảnh tham chiếu (referenceImage_*)
- **reference_image_manage**: Quản lý ảnh tham chiếu - thêm/xóa/quản lý ảnh tham chiếu trong khung nhìn cảnh
- **reference_image_view**: Khung nhìn ảnh tham chiếu - điều khiển hiển thị và chỉnh sửa ảnh tham chiếu

### 🎨 Khung nhìn cảnh (sceneView_*)
- **scene_view_control**: Điều khiển khung nhìn cảnh - điều khiển công cụ Gizmo, hệ tọa độ, chế độ xem
- **scene_view_tools**: Công cụ khung nhìn cảnh - quản lý các công cụ và tùy chọn khác nhau của khung nhìn cảnh

### ✅ Công cụ xác thực (validation_*)
- **validation_scene**: Xác thực cảnh - xác thực tính toàn vẹn của cảnh, kiểm tra tài nguyên bị thiếu
- **validation_asset**: Xác thực tài nguyên - xác thực tham chiếu tài nguyên, kiểm tra tính toàn vẹn tài nguyên

### 🛠️ Quản lý công cụ
- **Hệ thống cấu hình công cụ**: Bật/tắt công cụ có chọn lọc, hỗ trợ nhiều bộ cấu hình
- **Lưu cấu hình lâu dài**: Tự động lưu và tải cấu hình công cụ
- **Nhập/xuất cấu hình**: Hỗ trợ tính năng nhập và xuất cấu hình công cụ
- **Quản lý trạng thái theo thời gian thực**: Cập nhật và đồng bộ trạng thái công cụ theo thời gian thực

### 🚀 Ưu điểm cốt lõi
- **Thống nhất mã thao tác**: Tất cả công cụ đặt tên theo dạng "danh_mục_thao_tác", Schema tham số thống nhất
- **Khả năng tái sử dụng cao**: 50 công cụ cốt lõi bao phủ 99% tính năng trình biên tập
- **Thân thiện với AI**: Tham số rõ ràng, tài liệu hoàn thiện, dễ gọi
- **Tối ưu hiệu năng**: Giảm 50% mức tiêu thụ Token, nâng cao tỷ lệ gọi thành công của AI
- **Tương thích hoàn toàn**: Khớp 100% với API chính thức của Cocos Creator

## ⚠️ Đọc trước khi cài đặt (quan trọng)

> **Trước khi cài đặt lần đầu hoặc nâng cấp phiên bản, bạn nhất định phải xóa hai tệp `mcp-server.json` và `tool-manager.json` trong thư mục `settings/` của dự án hiện tại, nếu không danh sách công cụ của plugin sẽ hiển thị bất thường!**
>
> Đường dẫn tệp: `DuAnCuaBan/settings/mcp-server.json` và `DuAnCuaBan/settings/tool-manager.json`
> Sau khi xóa hai tệp này, chỉ cần mở lại bảng điều khiển plugin, mọi thứ sẽ trở lại bình thường.

## Hướng dẫn cài đặt

### 1. Sao chép tệp plugin

Sao chép toàn bộ thư mục `cocos-mcp-server` vào thư mục `extensions` trong dự án Cocos Creator của bạn, hoặc bạn cũng có thể nhập trực tiếp vào dự án thông qua trình quản lý phần mở rộng (Extension Manager):

```
DuAnCuaBan/
├── assets/
├── extensions/
│   └── cocos-mcp-server/          <- đặt plugin vào đây
│       ├── source/
│       ├── dist/
│       ├── package.json
│       └── ...
├── settings/
└── ...
```

### 2. Cài đặt dependency (thư viện phụ thuộc)

```bash
cd extensions/cocos-mcp-server
npm install
```

### 3. Build plugin

```bash
npm run build
```

### 4. Kích hoạt plugin

1. Khởi động lại Cocos Creator hoặc làm mới phần mở rộng
2. Plugin sẽ xuất hiện trong menu Extension
3. Nhấp vào `Extension > Cocos MCP Server` để mở bảng điều khiển

## Cách sử dụng

### Khởi động máy chủ

1. Mở bảng điều khiển máy chủ MCP từ `Extension > Cocos MCP Server`
2. Cấu hình các thiết lập:
   - **Cổng (Port)**: Cổng máy chủ HTTP (mặc định: 3000)
   - **Tự động khởi động**: Tự động khởi động máy chủ khi trình biên tập khởi động
   - **Log gỡ lỗi**: Bật log chi tiết để phục vụ gỡ lỗi trong quá trình phát triển
   - **Số kết nối tối đa**: Số lượng kết nối đồng thời tối đa được phép

3. Nhấp vào "Khởi động máy chủ" để bắt đầu chấp nhận kết nối

### Kết nối trợ lý AI

Máy chủ cung cấp endpoint HTTP tại `http://localhost:3000/mcp` (hoặc cổng bạn đã cấu hình).

Trợ lý AI có thể sử dụng giao thức MCP để kết nối và truy cập tất cả các công cụ khả dụng.


## Phát triển

### Cấu trúc dự án
```
cocos-mcp-server/
├── source/                    # Tệp nguồn TypeScript
│   ├── main.ts               # Điểm vào của plugin
│   ├── mcp-server.ts         # Triển khai máy chủ MCP
│   ├── settings.ts           # Quản lý cài đặt
│   ├── types/                # Định nghĩa kiểu TypeScript
│   ├── tools/                # Triển khai công cụ
│   │   ├── scene-tools.ts
│   │   ├── node-tools.ts
│   │   ├── component-tools.ts
│   │   ├── prefab-tools.ts
│   │   ├── project-tools.ts
│   │   ├── debug-tools.ts
│   │   ├── preferences-tools.ts
│   │   ├── server-tools.ts
│   │   ├── broadcast-tools.ts
│   │   ├── scene-advanced-tools.ts (đã được tích hợp vào node-tools.ts và scene-tools.ts)
│   │   ├── scene-view-tools.ts
│   │   ├── reference-image-tools.ts
│   │   └── asset-advanced-tools.ts
│   ├── panels/               # Triển khai bảng điều khiển UI
│   └── test/                 # Tệp kiểm thử
├── dist/                     # Đầu ra JavaScript sau khi biên dịch
├── static/                   # Tài nguyên tĩnh (biểu tượng, v.v.)
├── i18n/                     # Tệp đa ngôn ngữ
├── package.json              # Cấu hình plugin
└── tsconfig.json             # Cấu hình TypeScript
```

### Build từ mã nguồn

```bash
# Cài đặt dependency
npm install

# Build cho môi trường phát triển (chế độ theo dõi - watch mode)
npm run watch

# Build cho môi trường production
npm run build
```

### Thêm công cụ mới

1. Tạo class công cụ mới trong `source/tools/`
2. Triển khai interface `ToolExecutor`
3. Thêm công cụ vào phần khởi tạo trong `mcp-server.ts`
4. Công cụ sẽ tự động được công khai thông qua giao thức MCP

### Hỗ trợ TypeScript

Plugin được viết hoàn toàn bằng TypeScript, với các đặc điểm:
- Bật kiểm tra kiểu nghiêm ngặt (strict type checking)
- Cung cấp định nghĩa kiểu toàn diện cho tất cả API
- Hỗ trợ IntelliSense trong quá trình phát triển
- Tự động biên dịch sang JavaScript

## Xử lý sự cố

### Vấn đề thường gặp

1. **Máy chủ không khởi động được**: Kiểm tra tính khả dụng của cổng và cài đặt tường lửa
2. **Công cụ không hoạt động**: Đảm bảo cảnh đã được tải và UUID hợp lệ
3. **Lỗi build**: Chạy `npm run build` để kiểm tra lỗi TypeScript
4. **Vấn đề kết nối**: Xác minh URL HTTP và trạng thái máy chủ

### Chế độ gỡ lỗi

Bật log gỡ lỗi trong bảng điều khiển plugin để nhận log thao tác chi tiết.

### Sử dụng công cụ gỡ lỗi

```json
{
  "tool": "debug_get_console_logs",
  "arguments": {"limit": 50, "filter": "error"}
}
```

```json
{
  "tool": "debug_validate_scene",
  "arguments": {"checkMissingAssets": true}
}
```

## Yêu cầu hệ thống

- Cocos Creator 3.8.6 trở lên
- Node.js (đi kèm sẵn với Cocos Creator)
- TypeScript (được cài đặt như một dependency phát triển)

## Giấy phép

Plugin này được cung cấp để sử dụng trong các dự án Cocos Creator, đi kèm với mã nguồn đầy đủ, có thể dùng để học tập và trao đổi. Không có mã hóa. Bạn có thể tự do phát triển và tối ưu lại dựa trên mã nguồn này, nhưng bất kỳ mã nguồn nào của dự án này hoặc mã phái sinh từ nó đều không được phép sử dụng cho mục đích thương mại hoặc bán lại. Nếu cần sử dụng cho mục đích thương mại, vui lòng liên hệ với tác giả.

## Liên hệ để tham gia nhóm
<img alt="image" src="https://github.com/user-attachments/assets/a276682c-4586-480c-90e5-6db132e89e0f" width="400" height="400" />
