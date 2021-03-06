bundle({nesting: 'base'}, function() {
    const bundleSuite = this;

    describe('This bundle should be a child of the root suite', function() {
        it('this.parent is the root suite', function() {
            expect(bundleSuite.parent.root).to.be.true;
        });
    });

    bundle({nesting: 'One'}, function() {
        const bundleSuite = this;

        describe('A nested bundle should be a child of the first bundle', function() {
            it('this.parent is another bundle', function() {
                expect(bundleSuite.parent.root).to.be.false;
                expect(bundleSuite.parent.parameters).to.eql({nesting: 'base'});
            });
        });
    });

    bundle({nesting: 'One'}, function() {
        const bundleSuite = this;

        describe('A nested bundle with the same parameters should be combined into one',
            function() {
                it('has more than one suite', function() {
                    expect(bundleSuite.suites.length).to.be.above(1);
                });
            });
    });

    bundle({nesting: 'Two'}, function() {
        const bundleSuite = this;

        describe('A second nested bundle should be a sibling of the first nested bundle',
            function() {
                it('its sibling is the bundle defined on the same level', function() {
                    bundleSuite.parent.suites.forEach((bun) => {
                        if (typeof bun.parameters !== 'undefined') {
                            expect(JSON.stringify(bun.parameters)).to.be.oneOf([
                                JSON.stringify(bundleSuite.parameters),
                                JSON.stringify({nesting: 'One'}),
                            ]);
                        }
                    });
                });
            });
    });
});


describe('A random nesting level', function() {
    bundle({nesting: 'across levels'}, function() {
        const bundleSuite = this;

        describe('Multiple nested bundles with the same parameters on different nesting level',
            function() {
                it('hasn\'t bundles with a bundle on another nesting level', function() {
                    expect(bundleSuite.suites.length).to.be.equal(1);
                });
            });
    });
});


bundle({nesting: 'across levels'}, function() {
    const bundleSuite = this;

    describe('Multiple nested bundles with the same parameters on different nesting level',
        function() {
            it('hasn\'t bundles with a bundle on another nesting level', function() {
                expect(bundleSuite.suites.length).to.be.equal(1);
            });
        });
});
