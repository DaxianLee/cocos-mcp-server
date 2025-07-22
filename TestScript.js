"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestScript = void 0;
const cc_1 = require("cc");
const { ccclass, property } = cc_1._decorator;
let TestScript = class TestScript extends cc_1.Component {
    constructor() {
        super(...arguments);
        this.testString = "Hello World";
        this.testNumber = 100;
        this.testBoolean = true;
        this.targetNode = null;
    }
    start() {
        console.log('TestScript started with:', {
            testString: this.testString,
            testNumber: this.testNumber,
            testBoolean: this.testBoolean,
            targetNode: this.targetNode
        });
    }
    update(deltaTime) {
    }
};
exports.TestScript = TestScript;
__decorate([
    property({
        displayName: "测试字符串"
    })
], TestScript.prototype, "testString", void 0);
__decorate([
    property({
        displayName: "测试数字"
    })
], TestScript.prototype, "testNumber", void 0);
__decorate([
    property({
        displayName: "测试布尔值"
    })
], TestScript.prototype, "testBoolean", void 0);
__decorate([
    property(cc_1.Node)
], TestScript.prototype, "targetNode", void 0);
exports.TestScript = TestScript = __decorate([
    ccclass('TestScript')
], TestScript);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFNjcmlwdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlRlc3RTY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsMkJBQWlEO0FBQ2pELE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsZUFBVSxDQUFDO0FBR2xDLElBQU0sVUFBVSxHQUFoQixNQUFNLFVBQVcsU0FBUSxjQUFTO0lBQWxDOztRQUlJLGVBQVUsR0FBVyxhQUFhLENBQUM7UUFLbkMsZUFBVSxHQUFXLEdBQUcsQ0FBQztRQUt6QixnQkFBVyxHQUFZLElBQUksQ0FBQztRQUc1QixlQUFVLEdBQWdCLElBQUksQ0FBQztJQWMxQyxDQUFDO0lBWkcsS0FBSztRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUU7WUFDcEMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1lBQzNCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDN0IsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQzlCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxNQUFNLENBQUMsU0FBaUI7SUFFeEIsQ0FBQztDQUNKLENBQUE7QUEvQlksZ0NBQVU7QUFJWjtJQUhOLFFBQVEsQ0FBQztRQUNOLFdBQVcsRUFBRSxPQUFPO0tBQ3ZCLENBQUM7OENBQ3dDO0FBS25DO0lBSE4sUUFBUSxDQUFDO1FBQ04sV0FBVyxFQUFFLE1BQU07S0FDdEIsQ0FBQzs4Q0FDOEI7QUFLekI7SUFITixRQUFRLENBQUM7UUFDTixXQUFXLEVBQUUsT0FBTztLQUN2QixDQUFDOytDQUNpQztBQUc1QjtJQUROLFFBQVEsQ0FBQyxTQUFJLENBQUM7OENBQ3VCO3FCQWpCN0IsVUFBVTtJQUR0QixPQUFPLENBQUMsWUFBWSxDQUFDO0dBQ1QsVUFBVSxDQStCdEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBfZGVjb3JhdG9yLCBDb21wb25lbnQsIE5vZGUgfSBmcm9tICdjYyc7XG5jb25zdCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gPSBfZGVjb3JhdG9yO1xuXG5AY2NjbGFzcygnVGVzdFNjcmlwdCcpXG5leHBvcnQgY2xhc3MgVGVzdFNjcmlwdCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgZGlzcGxheU5hbWU6IFwi5rWL6K+V5a2X56ym5LiyXCJcbiAgICB9KVxuICAgIHB1YmxpYyB0ZXN0U3RyaW5nOiBzdHJpbmcgPSBcIkhlbGxvIFdvcmxkXCI7XG4gICAgXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgZGlzcGxheU5hbWU6IFwi5rWL6K+V5pWw5a2XXCJcbiAgICB9KVxuICAgIHB1YmxpYyB0ZXN0TnVtYmVyOiBudW1iZXIgPSAxMDA7XG4gICAgXG4gICAgQHByb3BlcnR5KHtcbiAgICAgICAgZGlzcGxheU5hbWU6IFwi5rWL6K+V5biD5bCU5YC8XCJcbiAgICB9KVxuICAgIHB1YmxpYyB0ZXN0Qm9vbGVhbjogYm9vbGVhbiA9IHRydWU7XG4gICAgXG4gICAgQHByb3BlcnR5KE5vZGUpXG4gICAgcHVibGljIHRhcmdldE5vZGU6IE5vZGUgfCBudWxsID0gbnVsbDtcblxuICAgIHN0YXJ0KCkge1xuICAgICAgICBjb25zb2xlLmxvZygnVGVzdFNjcmlwdCBzdGFydGVkIHdpdGg6Jywge1xuICAgICAgICAgICAgdGVzdFN0cmluZzogdGhpcy50ZXN0U3RyaW5nLFxuICAgICAgICAgICAgdGVzdE51bWJlcjogdGhpcy50ZXN0TnVtYmVyLFxuICAgICAgICAgICAgdGVzdEJvb2xlYW46IHRoaXMudGVzdEJvb2xlYW4sXG4gICAgICAgICAgICB0YXJnZXROb2RlOiB0aGlzLnRhcmdldE5vZGVcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdXBkYXRlKGRlbHRhVGltZTogbnVtYmVyKSB7XG4gICAgICAgIFxuICAgIH1cbn0iXX0=